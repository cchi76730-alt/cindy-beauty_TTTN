using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace CosmeticShop_Backend.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }
            = string.Empty;

        public string Description { get; set; }
            = string.Empty;

        public string Origin { get; set; }
            = string.Empty;

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public string ImageUrl { get; set; }
            = string.Empty;

        public double Rating { get; set; }

        public int CategoryId { get; set; }

        public Category? Category { get; set; }

        public int? BrandId { get; set; }

        public Brand? Brand { get; set; }

        // Da dầu / Da khô / Da hỗn hợp
        public string? SkinType { get; set; }

        // Mụn / Thâm / Dưỡng trắng
        public string? Concern { get; set; }

        // Bình dân / Trung cấp / Cao cấp
        public string? PriceRange { get; set; }

        public int DiscountPercent { get; set; }

        // =========================
        // BỔ SUNG
        // =========================

        public string Status { get; set; }
            = "Active";

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        // KHÔNG TẠO CỘT TRONG DATABASE
        [NotMapped]
        public IFormFile? ImageFile { get; set; }

        // Giá sau giảm
        public decimal FinalPrice
        {
            get
            {
                return Price -
                    (Price * DiscountPercent / 100);
            }
        }

        // Còn hàng không
        public bool IsInStock
        {
            get
            {
                return Stock > 0;
            }
        }
    }
}