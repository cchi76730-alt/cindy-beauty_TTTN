using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class Review
    {
        public int Id { get; set; }

        // =========================
        // PRODUCT
        // =========================

        [Required]
        public int ProductId { get; set; }

        public Product? Product { get; set; }

        // =========================
        // USER INFO
        // =========================

        [Required]
        [StringLength(100)]
        public string UserName { get; set; }
            = string.Empty;

        [StringLength(100)]
        public string? UserEmail { get; set; }

        // =========================
        // REVIEW CONTENT
        // =========================

        [Required]
        [StringLength(2000)]
        public string Comment { get; set; }
            = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        // =========================
        // MEDIA
        // =========================

        // image/video url
        public string? MediaUrl { get; set; }

        // image | video
        public string? MediaType { get; set; }

        // =========================
        // ADMIN MANAGEMENT
        // =========================

        // Ẩn review xấu/spam
        public bool IsHidden { get; set; }
            = false;

        // Admin reply
        public string? AdminReply { get; set; }

        // Có phải spam không
        public bool IsSpam { get; set; }
            = false;

        // =========================
        // DATE
        // =========================

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        // =========================
        // HELPER
        // =========================

        public string RatingText
        {
            get
            {
                return Rating switch
                {
                    1 => "Rất tệ",
                    2 => "Tệ",
                    3 => "Bình thường",
                    4 => "Tốt",
                    5 => "Rất tốt",
                    _ => "Không xác định"
                };
            }
        }
    }
}