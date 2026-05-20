using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CosmeticShop_Backend.Data;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromotionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Promotions
        [HttpGet]
        public async Task<IActionResult> GetPromotions()
        {
            var promotions = await _context.Promotions
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.DiscountPercent,
                    p.BannerUrl
                })
                .ToListAsync();

            return Ok(promotions);
        }

        // GET: api/Promotions/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPromotionDetail(int id)
        {
            var promotion = await _context.Promotions
                .Include(p => p.PromotionProducts)
                .ThenInclude(pp => pp.Product)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (promotion == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                promotion.Id,
                promotion.Title,
                promotion.Description,
                promotion.DiscountPercent,
                promotion.BannerUrl,

                Products = promotion.PromotionProducts
                    .Select(pp => new
                    {
                        pp.Product.Id,
                        pp.Product.Name,
                        pp.Product.Description,
                        pp.Product.Price,
                        pp.Product.ImageUrl,
                        pp.Product.Origin
                    })
                    .ToList()
            });
        }
    }
}