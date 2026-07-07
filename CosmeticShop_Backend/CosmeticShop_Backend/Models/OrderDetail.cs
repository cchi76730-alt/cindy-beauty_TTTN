namespace CosmeticShop_Backend.Models
{
    public class OrderDetail
    {
        public int Id { get; set; }

        // =========================
        // ORDER
        // =========================

        public int OrderId { get; set; }

        public Order? Order { get; set; }

        // =========================
        // PRODUCT
        // =========================

        public int ProductId { get; set; }

        public Product? Product { get; set; }

        // =========================
        // INFO
        // =========================

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        // =========================
        // HELPER
        // =========================

        public decimal TotalPrice
        {
            get
            {
                return Quantity * Price;
            }
        }
    }
}