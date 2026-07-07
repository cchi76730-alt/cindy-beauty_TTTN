using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Route("api/admin/brands")]
    [ApiController]
    public class AdminBrandsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminBrandsController(
            AppDbContext context,
            IWebHostEnvironment env
        )
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var brands = await _context.Brands
                .Include(b => b.Products)
                .OrderByDescending(b => b.Id)
                .ToListAsync();

            return Ok(brands);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var brand = await _context.Brands
                .Include(b => b.Products)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (brand == null)
                return NotFound("Không tìm thấy thương hiệu");

            return Ok(brand);
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm] Brand model,
            IFormFile? image
        )
        {
            if (string.IsNullOrWhiteSpace(model.Name))
                return BadRequest("Tên thương hiệu không được trống");

            if (image != null)
            {
                var fileName = await SaveImage(image);

                model.ThumbnailUrl = fileName;
                model.LogoUrl = fileName;
                model.BannerUrl = fileName;
            }

            model.CreatedAt = DateTime.Now;
            model.UpdatedAt = DateTime.Now;
            model.IsActive = true;

            _context.Brands.Add(model);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromForm] Brand model,
            IFormFile? image
        )
        {
            var brand = await _context.Brands
                .FirstOrDefaultAsync(b => b.Id == id);

            if (brand == null)
                return NotFound("Không tìm thấy thương hiệu");

            if (string.IsNullOrWhiteSpace(model.Name))
                return BadRequest("Tên thương hiệu không được trống");

            brand.Name = model.Name;
            brand.Description = model.Description;
            brand.Country = model.Country;
            brand.Website = model.Website;
            brand.FoundedYear = model.FoundedYear;
            brand.IsActive = model.IsActive;
            brand.IsFeatured = model.IsFeatured;
            brand.Slug = model.Slug;
            brand.MetaTitle = model.MetaTitle;
            brand.MetaDescription = model.MetaDescription;
            brand.UpdatedAt = DateTime.Now;

            if (image != null)
            {
                var fileName = await SaveImage(image);

                brand.ThumbnailUrl = fileName;
                brand.LogoUrl = fileName;
                brand.BannerUrl = fileName;
            }

            await _context.SaveChangesAsync();

            return Ok(brand);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
                return NotFound("Không tìm thấy thương hiệu");

            var hasProducts = await _context.Products
                .AnyAsync(p => p.BrandId == id);

            if (hasProducts)
                return BadRequest("Không thể xóa thương hiệu đang có sản phẩm");

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa thương hiệu thành công"
            });
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            var webRootPath = _env.WebRootPath;

            if (string.IsNullOrWhiteSpace(webRootPath))
            {
                webRootPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot"
                );
            }

            var imageFolder = Path.Combine(
                webRootPath,
                "images"
            );

            if (!Directory.Exists(imageFolder))
            {
                Directory.CreateDirectory(imageFolder);
            }

            var fileName =
                Guid.NewGuid().ToString()
                + Path.GetExtension(image.FileName);

            var filePath = Path.Combine(
                imageFolder,
                fileName
            );

            using (var stream = new FileStream(
                filePath,
                FileMode.Create
            ))
            {
                await image.CopyToAsync(stream);
            }

            return fileName;
        }
    }
}