using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class AdminMessage
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string SenderName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? SenderEmail { get; set; }

        [StringLength(20)]
        public string? SenderPhone { get; set; }

        public int? ProductId { get; set; }

        [StringLength(200)]
        public string? ProductName { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;

        public string? AdminReply { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? RepliedAt { get; set; }
    }
}