using Microsoft.AspNetCore.Mvc;
using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        // GET: api/products?categoryId=1
        // GET: api/products?brandId=1
        // GET: api/products?categoryId=1&brandId=2
        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] int? categoryId,
            [FromQuery] int? brandId)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (brandId.HasValue)
            {
                query = query.Where(p => p.BrandId == brandId.Value);
            }

            var products = await query
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Origin,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    p.Rating,
                    p.CategoryId,
                    p.BrandId,

                    Category = p.Category == null ? null : new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Icon
                    },

                    Brand = p.Brand == null ? null : new
                    {
                        p.Brand.Id,
                        p.Brand.Name,
                        p.Brand.BannerUrl
                    }
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/products/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Origin,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    p.Rating,
                    p.CategoryId,
                    p.BrandId,

                    Category = p.Category == null ? null : new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Icon
                    },

                    Brand = p.Brand == null ? null : new
                    {
                        p.Brand.Id,
                        p.Brand.Name,
                        p.Brand.BannerUrl
                    }
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> CreateProduct(Product product)
        {
            if (product.CategoryId <= 0)
                return BadRequest("CategoryId không hợp lệ");

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == product.CategoryId);

            if (!categoryExists)
                return BadRequest("CategoryId không tồn tại");

            if (product.BrandId.HasValue)
            {
                var brandExists = await _context.Brands
                    .AnyAsync(b => b.Id == product.BrandId.Value);

                if (!brandExists)
                    return BadRequest("BrandId không tồn tại");
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // PUT: api/products/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
                return BadRequest();

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == product.CategoryId);

            if (!categoryExists)
                return BadRequest("CategoryId không tồn tại");

            if (product.BrandId.HasValue)
            {
                var brandExists = await _context.Brands
                    .AnyAsync(b => b.Id == product.BrandId.Value);

                if (!brandExists)
                    return BadRequest("BrandId không tồn tại");
            }

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // DELETE: api/products/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}