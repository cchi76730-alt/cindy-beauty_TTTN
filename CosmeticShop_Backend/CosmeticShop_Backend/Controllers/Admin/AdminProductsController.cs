using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // Admin, Staff, Warehouse đều được xem sản phẩm
        [Authorize(Roles = "Admin,Staff,Warehouse")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(x => x.Category)
                .Include(x => x.Brand)
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            return Ok(products);
        }

        // Chỉ Admin được thêm sản phẩm
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Product model, IFormFile? image)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.Name))
                    return BadRequest("Tên sản phẩm không được để trống");

                if (string.IsNullOrWhiteSpace(model.Description))
                    return BadRequest("Mô tả sản phẩm không được để trống");

                if (model.Price <= 0)
                    return BadRequest("Giá sản phẩm phải lớn hơn 0");

                if (model.Stock < 0)
                    return BadRequest("Tồn kho không hợp lệ");

                var categoryExists = await _context.Categories
                    .AnyAsync(x => x.Id == model.CategoryId);

                if (!categoryExists)
                    return BadRequest("CategoryId không tồn tại");

                if (model.BrandId.HasValue)
                {
                    var brandExists = await _context.Brands
                        .AnyAsync(x => x.Id == model.BrandId.Value);

                    if (!brandExists)
                        return BadRequest("BrandId không tồn tại");
                }

                if (image != null)
                {
                    model.ImageUrl = await SaveImage(image);
                }

                model.CreatedAt = DateTime.Now;

                _context.Products.Add(model);
                await _context.SaveChangesAsync();

                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Chỉ Admin được sửa sản phẩm
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Product model, IFormFile? image)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                    return NotFound("Không tìm thấy sản phẩm");

                if (string.IsNullOrWhiteSpace(model.Name))
                    return BadRequest("Tên sản phẩm không được để trống");

                if (string.IsNullOrWhiteSpace(model.Description))
                    return BadRequest("Mô tả sản phẩm không được để trống");

                if (model.Price <= 0)
                    return BadRequest("Giá sản phẩm phải lớn hơn 0");

                if (model.Stock < 0)
                    return BadRequest("Tồn kho không hợp lệ");

                var categoryExists = await _context.Categories
                    .AnyAsync(x => x.Id == model.CategoryId);

                if (!categoryExists)
                    return BadRequest("CategoryId không tồn tại");

                if (model.BrandId.HasValue)
                {
                    var brandExists = await _context.Brands
                        .AnyAsync(x => x.Id == model.BrandId.Value);

                    if (!brandExists)
                        return BadRequest("BrandId không tồn tại");
                }

                product.Name = model.Name;
                product.Description = model.Description;
                product.Price = model.Price;
                product.Stock = model.Stock;
                product.CategoryId = model.CategoryId;
                product.BrandId = model.BrandId;
                product.DiscountPercent = model.DiscountPercent;
                product.Origin = model.Origin;
                product.SkinType = model.SkinType;
                product.Concern = model.Concern;
                product.PriceRange = model.PriceRange;
                product.Status = model.Status;

                if (image != null)
                {
                    product.ImageUrl = await SaveImage(image);
                }

                await _context.SaveChangesAsync();

                return Ok(product);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Chỉ Admin được xóa sản phẩm
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound("Không tìm thấy sản phẩm");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            var webRootPath = _env.WebRootPath;

            if (string.IsNullOrEmpty(webRootPath))
            {
                webRootPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot"
                );
            }

            var imageFolder = Path.Combine(webRootPath, "images");

            if (!Directory.Exists(imageFolder))
            {
                Directory.CreateDirectory(imageFolder);
            }

            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var path = Path.Combine(imageFolder, fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return $"https://localhost:7019/images/{fileName}";
        }
    }
}