namespace CosmeticShop_Backend.Models
{
    public class Promotion
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int DiscountPercent { get; set; }

        public string BannerUrl { get; set; }

        public ICollection<PromotionProduct> PromotionProducts { get; set; }
    }
}
