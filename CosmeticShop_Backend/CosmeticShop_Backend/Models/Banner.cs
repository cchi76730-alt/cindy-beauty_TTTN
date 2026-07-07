namespace CosmeticShop_Backend.Models
{
    public class Banner
    {
        public int Id { get; set; }

        // =========================
        // CONTENT
        // =========================

        public string Title { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        // =========================
        // IMAGE
        // =========================

        public string ImageUrl { get; set; }
            = string.Empty;

        // =========================
        // LINK
        // =========================

        public string? LinkUrl { get; set; }

        // =========================
        // STATUS
        // =========================

        public bool IsActive { get; set; }
            = true;

        // =========================
        // DATE
        // =========================

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;
    }
}