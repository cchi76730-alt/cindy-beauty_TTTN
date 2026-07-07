namespace CosmeticShop_Backend.Models
{
    public class AdminUser
    {
        public int Id { get; set; }

        public string FullName { get; set; } = "";

        public string Email { get; set; } = "";

        public string Password { get; set; } = "";

        public string Role { get; set; } = "Admin";
    }
}