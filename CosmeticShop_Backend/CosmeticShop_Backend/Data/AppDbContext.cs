using CosmeticShop_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace CosmeticShop_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(
            DbContextOptions<AppDbContext> options
        ) : base(options)
        {
        }

        // =========================
        // TABLES
        // =========================

        public DbSet<Product> Products { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Review> Reviews { get; set; }

        public DbSet<Promotion> Promotions { get; set; }

        public DbSet<PromotionProduct> PromotionProducts { get; set; }

        public DbSet<Brand> Brands { get; set; }

        public DbSet<CustomerNotification> CustomerNotifications { get; set; }

        // ADMIN

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderDetail> OrderDetails { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Banner> Banners { get; set; }

        public DbSet<InventoryLog> InventoryLogs { get; set; }

        public DbSet<AdminUser> Admins { get; set; }

        public DbSet<AdminMessage> AdminMessages { get; set; }

        public DbSet<Conversation> Conversations { get; set; }

        public DbSet<ConversationMessage> ConversationMessages { get; set; }

        public DbSet<AdminNotificationRead> AdminNotificationReads { get; set; }

        public DbSet<Attendance> Attendances { get; set; }

        // =========================
        // RELATIONSHIPS
        // =========================

        protected override void OnModelCreating(
            ModelBuilder modelBuilder
        )
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // PromotionProduct
            // =========================

            modelBuilder.Entity<PromotionProduct>()
                .HasKey(pp => new
                {
                    pp.PromotionId,
                    pp.ProductId
                });

            modelBuilder.Entity<PromotionProduct>()
                .HasOne(pp => pp.Promotion)
                .WithMany(p => p.PromotionProducts)
                .HasForeignKey(pp => pp.PromotionId);

            modelBuilder.Entity<PromotionProduct>()
                .HasOne(pp => pp.Product)
                .WithMany()
                .HasForeignKey(pp => pp.ProductId);

            // =========================
            // Product - Brand
            // =========================

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // Product - Category
            // =========================

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // Review - Product
            // =========================

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================
            // OrderDetail - Order
            // =========================

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderDetails)
                .HasForeignKey(od => od.OrderId);

            // =========================
            // OrderDetail - Product
            // =========================

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Product)
                .WithMany()
                .HasForeignKey(od => od.ProductId);

            // =========================
            // InventoryLog - Product
            // =========================

            modelBuilder.Entity<InventoryLog>()
                .HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId);

            // =========================
            // DECIMAL CONFIG
            // =========================

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderDetail>()
                .Property(od => od.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Attendance>()
    .HasOne(a => a.Employee)
    .WithMany()
    .HasForeignKey(a => a.EmployeeId);


            modelBuilder.Entity<ConversationMessage>()
    .HasOne(m => m.Conversation)
    .WithMany(c => c.Messages)
    .HasForeignKey(m => m.ConversationId)
    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}