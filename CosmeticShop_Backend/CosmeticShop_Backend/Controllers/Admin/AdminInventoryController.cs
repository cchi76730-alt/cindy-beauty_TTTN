using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    //[Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/inventory")]
    public class AdminInventoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminInventoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetInventory()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .OrderBy(p => p.Stock)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.ImageUrl,
                    p.Price,
                    p.Stock,
                    p.Status,
                    CategoryName = p.Category != null ? p.Category.Name : "Không có",
                    BrandName = p.Brand != null ? p.Brand.Name : "Không có",
                    StockStatus =
                        p.Stock <= 0 ? "OutOfStock" :
                        p.Stock <= 10 ? "LowStock" :
                        "InStock",
                    InventoryValue = p.Price * p.Stock
                })
                .ToListAsync();

            var summary = new
            {
                TotalProducts = products.Count,
                TotalStock = products.Sum(x => x.Stock),
                LowStock = products.Count(x => x.Stock > 0 && x.Stock <= 10),
                OutOfStock = products.Count(x => x.Stock <= 0),
                TotalInventoryValue = products.Sum(x => x.InventoryValue)
            };

            return Ok(new
            {
                summary,
                products
            });
        }

        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _context.InventoryLogs
                .Include(x => x.Product)
                .OrderByDescending(x => x.CreatedAt)
                .Take(100)
                .Select(x => new
                {
                    x.Id,
                    x.ProductId,
                    ProductName = x.Product != null ? x.Product.Name : "Không rõ",
                    x.Type,
                    x.Quantity,
                    x.Note,
                    x.CreatedAt
                })
                .ToListAsync();

            return Ok(logs);
        }

        [HttpPut("products/{id}/stock")]
        public async Task<IActionResult> UpdateStock(
            int id,
            [FromBody] UpdateStockRequest request
        )
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound("Không tìm thấy sản phẩm");

            if (request.Quantity <= 0)
                return BadRequest("Số lượng phải lớn hơn 0");

            if (request.Type != "Import" && request.Type != "Export")
                return BadRequest("Loại kho không hợp lệ");

            if (request.Type == "Export" && product.Stock < request.Quantity)
                return BadRequest("Không đủ hàng để xuất kho");

            if (request.Type == "Import")
                product.Stock += request.Quantity;

            if (request.Type == "Export")
                product.Stock -= request.Quantity;

            var log = new InventoryLog
            {
                ProductId = product.Id,
                Type = request.Type,
                Quantity = request.Quantity,
                Note = request.Note,
                CreatedAt = DateTime.Now
            };

            _context.InventoryLogs.Add(log);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật tồn kho thành công",
                product
            });
        }
    }

    public class UpdateStockRequest
    {
        public string Type { get; set; } = "Import";
        public int Quantity { get; set; }
        public string? Note { get; set; }
    }
}