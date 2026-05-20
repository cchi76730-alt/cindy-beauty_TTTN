using Microsoft.EntityFrameworkCore;
using CosmeticShop_Backend.Models;

namespace CosmeticShop_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Review> Reviews { get; set; }

        public DbSet<Promotion> Promotions { get; set; }

        public DbSet<PromotionProduct> PromotionProducts { get; set; }

        public DbSet<Brand> Brands { get; set; }

        // THÊM ĐOẠN NÀY
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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

            modelBuilder.Entity<Product>()
    .HasOne(p => p.Brand)
    .WithMany(b => b.Products)
    .HasForeignKey(p => p.BrandId);
        }
    }
}