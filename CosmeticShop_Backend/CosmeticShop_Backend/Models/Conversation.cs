using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class Conversation
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? CustomerEmail { get; set; }

        [StringLength(20)]
        public string? CustomerPhone { get; set; }

        public int? ProductId { get; set; }

        [StringLength(200)]
        public string? ProductName { get; set; }

        public bool IsClosed { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public ICollection<ConversationMessage> Messages { get; set; }
            = new List<ConversationMessage>();
    }
}