using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using CosmeticShop_Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using System.Text.Json.Serialization;
using static System.Net.WebRequestMethods;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

var databaseUrl = builder.Configuration["DATABASE_URL"];
var configuredConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var databaseProvider = builder.Configuration["DatabaseProvider"];

if (string.IsNullOrWhiteSpace(databaseProvider))
{
    databaseProvider = IsPostgresUrl(databaseUrl) || IsPostgresUrl(configuredConnectionString)
        ? "Postgres"
        : "SqlServer";
}

var connectionString = GetConnectionString(
    builder.Configuration,
    databaseProvider,
    databaseUrl
);

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? "THIS_IS_MY_SUPER_SECRET_KEY_123456789_ABCDEFG";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CosmeticShop";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CosmeticShop";
var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? new[]
    {
        "http://localhost:5173",
        "https://cindy-beauty-tttn.onrender.com",
        "https://localhost:5173",
        "http://localhost:5174",
        "https://localhost:5174"
    };

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (IsPostgresProvider(databaseProvider))
    {
        options.UseNpgsql(connectionString);
        return;
    }

    options.UseSqlServer(connectionString);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    )
            };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler
            = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

InitializeDatabase(app, databaseProvider);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static bool IsPostgresProvider(string? provider)
{
    return string.Equals(provider, "Postgres", StringComparison.OrdinalIgnoreCase)
        || string.Equals(provider, "PostgreSQL", StringComparison.OrdinalIgnoreCase);
}

static bool IsPostgresUrl(string? databaseUrl)
{
    return databaseUrl?.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) == true
        || databaseUrl?.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) == true;
}

static string GetConnectionString(
    IConfiguration configuration,
    string? databaseProvider,
    string? databaseUrl)
{
    if (IsPostgresProvider(databaseProvider) && !string.IsNullOrWhiteSpace(databaseUrl))
    {
        return IsPostgresUrl(databaseUrl)
            ? ConvertPostgresUrlToConnectionString(databaseUrl)
            : databaseUrl;
    }

    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "Missing database connection string. Set ConnectionStrings__DefaultConnection or DATABASE_URL."
        );
    }

    return IsPostgresProvider(databaseProvider) && IsPostgresUrl(connectionString)
        ? ConvertPostgresUrlToConnectionString(connectionString)
        : connectionString;
}

static string ConvertPostgresUrlToConnectionString(string databaseUrl)
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo.ElementAtOrDefault(0) ?? "");
    var password = Uri.UnescapeDataString(userInfo.ElementAtOrDefault(1) ?? "");
    var database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/'));

    var builder = new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.Port > 0 ? uri.Port : 5432,
        Database = database,
        Username = username,
        Password = password,
        SslMode = SslMode.Require,
        TrustServerCertificate = true
    };

    return builder.ConnectionString;
}

static void InitializeDatabase(WebApplication app, string? databaseProvider)
{
    using var scope = app.Services.CreateScope();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var initMode = configuration["DatabaseInitMode"];

    if (string.Equals(initMode, "EnsureCreated", StringComparison.OrdinalIgnoreCase))
    {
        // Demo only: use with a fresh empty database. Do not use for long-term databases that need migration history.
        db.Database.EnsureCreated();
    }
    else if (string.Equals(initMode, "Migrate", StringComparison.OrdinalIgnoreCase))
    {
        if (IsPostgresProvider(databaseProvider))
        {
            throw new InvalidOperationException(
                "PostgreSQL migrations are not configured. Use DatabaseInitMode=EnsureCreated for a fresh demo database."
            );
        }

        db.Database.Migrate();
    }

    SeedAdminIfEnabled(configuration, db);
}

static void SeedAdminIfEnabled(IConfiguration configuration, AppDbContext db)
{
    var seedEnabled = string.Equals(
        configuration["SeedData:Enabled"],
        "true",
        StringComparison.OrdinalIgnoreCase
    );

    if (!seedEnabled)
    {
        return;
    }

    var email = configuration["SeedData:AdminEmail"]?.Trim().ToLower();
    var password = configuration["SeedData:AdminPassword"];
    var fullName = configuration["SeedData:AdminFullName"]?.Trim();

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
    {
        throw new InvalidOperationException(
            "Seed admin requires SeedData__AdminEmail and SeedData__AdminPassword."
        );
    }

    var exists = db.Admins.Any(admin => admin.Email.ToLower() == email);

    if (exists)
    {
        return;
    }

    db.Admins.Add(new AdminUser
    {
        FullName = string.IsNullOrWhiteSpace(fullName) ? "Demo Admin" : fullName,
        Email = email,
        Password = password,
        Role = "Admin"
    });

    db.SaveChanges();
}
