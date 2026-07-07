namespace CosmeticShop_Backend.Models
{
    public class InventoryLog
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public Product? Product { get; set; }

        // Import / Export
        public string Type { get; set; } = "Import";

        public int Quantity { get; set; }

        public string? Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}