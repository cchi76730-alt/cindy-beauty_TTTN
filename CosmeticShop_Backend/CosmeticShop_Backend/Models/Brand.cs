using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class Brand
    {
        public int Id { get; set; }

        // =========================
        // BASIC INFO
        // =========================

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
            = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        // =========================
        // MEDIA
        // =========================

        // logo thương hiệu
        public string? LogoUrl { get; set; }

        // banner thương hiệu
        public string? BannerUrl { get; set; }

        // ảnh thumbnail
        public string? ThumbnailUrl { get; set; }

        // =========================
        // BRAND INFO
        // =========================

        // quốc gia
        public string? Country { get; set; }

        // website chính thức
        public string? Website { get; set; }

        // năm thành lập
        public int? FoundedYear { get; set; }

        // =========================
        // STATUS
        // =========================

        public bool IsActive { get; set; }
            = true;

        public bool IsFeatured { get; set; }
            = false;

        // =========================
        // SEO
        // =========================

        public string? Slug { get; set; }

        public string? MetaTitle { get; set; }

        public string? MetaDescription { get; set; }

        // =========================
        // DATE
        // =========================

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        // =========================
        // NAVIGATION
        // =========================

        public ICollection<Product>? Products
        {
            get;
            set;
        }

        // =========================
        // HELPER
        // =========================

        public int ProductCount
        {
            get
            {
                return Products?.Count ?? 0;
            }
        }
    }
}