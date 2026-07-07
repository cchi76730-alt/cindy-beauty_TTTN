namespace CosmeticShop_Backend.Models
{
    public class Employee
    {
        public int Id { get; set; }

        // =========================
        // BASIC INFO
        // =========================

        public string FullName { get; set; }
            = string.Empty;

        public string Email { get; set; }
            = string.Empty;

        public string Password { get; set; }
            = string.Empty;

        public string Phone { get; set; }
            = string.Empty;

        // =========================
        // ROLE
        // =========================

        public string Role { get; set; }
            = "Staff";

        // Admin / Staff / Warehouse

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