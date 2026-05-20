namespace CosmeticShop_Backend.Models
{
    public class Review
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string UserName { get; set; } = "";

        public string Comment { get; set; } = "";

        public int Rating { get; set; }

        // image/video
        public string? MediaUrl { get; set; }

        public string? MediaType { get; set; }

        // time
        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        // navigation
        public Product? Product { get; set; }
    }
}