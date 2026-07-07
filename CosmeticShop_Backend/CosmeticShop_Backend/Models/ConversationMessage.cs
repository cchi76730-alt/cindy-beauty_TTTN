using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class ConversationMessage
    {
        public int Id { get; set; }

        public int ConversationId { get; set; }

        public Conversation? Conversation { get; set; }

        // customer / admin
        [Required]
        [StringLength(20)]
        public string SenderType { get; set; } = "customer";

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}