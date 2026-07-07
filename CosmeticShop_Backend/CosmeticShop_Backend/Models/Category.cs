using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
            = string.Empty;

        public string Icon { get; set; }
            = string.Empty;

        public List<Product>? Products { get; set; }

        // =========================
        // BỔ SUNG
        // =========================

        public string? Description { get; set; }

        public bool IsActive { get; set; }
            = true;

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;
    }
}