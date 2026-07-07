namespace CosmeticShop_Backend.Models
{
    public class AdminNotificationRead
    {
        public int Id { get; set; }

        public string Type { get; set; } = string.Empty;

        public int TargetId { get; set; }

        public DateTime ReadAt { get; set; } = DateTime.Now;
    }
}