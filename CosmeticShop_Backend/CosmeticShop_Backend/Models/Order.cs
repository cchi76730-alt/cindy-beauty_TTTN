using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class Order
    {
        public int Id { get; set; }

        // =========================
        // CUSTOMER INFO
        // =========================

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }
            = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; }
            = string.Empty;

        [Required]
        [StringLength(300)]
        public string Address { get; set; }
            = string.Empty;

        [StringLength(200)]
        public string? Email { get; set; }

        // =========================
        // ORDER INFO
        // =========================

        public decimal TotalAmount { get; set; }

        // Pending / Confirmed / Shipping / Completed / Cancelled
        public string Status { get; set; }
            = "Pending";

        // =========================
        // PAYMENT
        // =========================

        // COD / Banking / Momo / ZaloPay
        public string PaymentMethod { get; set; }
            = "COD";

        // Unpaid / Paid
        public string PaymentStatus { get; set; }
            = "Unpaid";

        // =========================
        // SHIPPING
        // =========================

        public decimal ShippingFee { get; set; }
            = 0;

        public string? ShippingCode { get; set; }

        // =========================
        // NOTE
        // =========================

        public string? Note { get; set; }

        // =========================
        // CUSTOMER RELATION
        // =========================

        public int? CustomerId { get; set; }

        public Customer? Customer { get; set; }

        // =========================
        // DATE
        // =========================

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        // =========================
        // NAVIGATION
        // =========================

        public ICollection<OrderDetail>?
            OrderDetails
        { get; set; }

        // =========================
        // HELPER
        // =========================

        public int TotalProducts
        {
            get
            {
                return OrderDetails?
                    .Sum(x => x.Quantity) ?? 0;
            }
        }

        public bool IsCompleted
        {
            get
            {
                return Status == "Completed";
            }
        }
    }
}