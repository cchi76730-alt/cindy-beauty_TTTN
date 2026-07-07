using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.IdentityModel.Tokens;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Route("api/admin-auth")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminAuthController(
            AppDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public async Task<IActionResult> Register(AdminUser model)
        {
            var checkEmail = await _context.Admins
                .FirstOrDefaultAsync(x => x.Email == model.Email);

            if (checkEmail != null)
            {
                return BadRequest(new
                {
                    message = "Email đã tồn tại"
                });
            }

            model.Role = "Admin";

            _context.Admins.Add(model);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng ký thành công"
            });
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login(AdminUser model)
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(x =>
                    x.Email == model.Email &&
                    x.Password == model.Password
                );

            if (admin != null)
            {
                var jwt = GenerateToken(admin.Email, admin.Role);

                return Ok(new
                {
                    token = jwt,
                    admin = new
                    {
                        admin.Id,
                        admin.FullName,
                        admin.Email,
                        admin.Role
                    }
                });
            }

            var employee = await _context.Employees
                .FirstOrDefaultAsync(x =>
                    x.Email == model.Email &&
                    x.Password == model.Password &&
                    x.IsActive == true
                );

            if (employee != null)
            {
                var jwt = GenerateToken(employee.Email, employee.Role);

                return Ok(new
                {
                    token = jwt,
                    admin = new
                    {
                        employee.Id,
                        employee.FullName,
                        employee.Email,
                        employee.Role
                    }
                });
            }

            return Unauthorized(new
            {
                message = "Sai tài khoản hoặc mật khẩu"
            });
        }

        private string GenerateToken(string email, string role)
        {
            var jwtKey = _configuration["Jwt:Key"]
                ?? "THIS_IS_MY_SUPER_SECRET_KEY_123456789_ABCDEFG";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "CosmeticShop";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "CosmeticShop";

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, email),
        new Claim(ClaimTypes.Role, role)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
