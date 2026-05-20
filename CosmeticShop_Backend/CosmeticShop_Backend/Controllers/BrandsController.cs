using CosmeticShop_Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await _context.Brands
                .Select(b => new
                {
                    b.Id,
                    b.Name,
                    b.Description,
                    b.BannerUrl,
                    ProductCount = _context.Products.Count(p => p.BrandId == b.Id)
                })
                .ToListAsync();

            return Ok(brands);
        }
    }
}