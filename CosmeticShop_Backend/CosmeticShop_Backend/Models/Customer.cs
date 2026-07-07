namespace CosmeticShop_Backend.Models
{
    public class Customer
    {
        public int Id { get; set; }

        public string FullName { get; set; }
            = string.Empty;

        public string Email { get; set; }
            = string.Empty;

        public string Phone { get; set; }
            = string.Empty;

        public string Password { get; set; }
            = string.Empty;

        public bool IsBlocked { get; set; }
    }
}