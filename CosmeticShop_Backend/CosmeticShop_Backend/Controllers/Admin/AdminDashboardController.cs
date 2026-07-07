using CosmeticShop_Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Route("api/admin/dashboard")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var totalRevenue = await _context.Orders
                .Where(o =>
                    o.Status == "Completed" ||
                    o.PaymentStatus == "Paid"
                )
                .SumAsync(o => o.TotalAmount);

            var totalOrders = await _context.Orders
                .CountAsync();

            var totalProducts = await _context.Products
                .CountAsync();

            var totalCustomers = await _context.Orders
                .Select(o => o.Phone)
                .Distinct()
                .CountAsync();

            var latestOrders = await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    o.CustomerName,
                    o.TotalAmount,
                    o.Status,
                    o.PaymentStatus,
                    o.CreatedAt
                })
                .ToListAsync();

            var lowStockProducts = await _context.Products
                .Where(p => p.Stock <= 10)
                .OrderBy(p => p.Stock)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Stock,
                    p.ImageUrl
                })
                .ToListAsync();

            return Ok(new
            {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                latestOrders,
                lowStockProducts
            });
        }
    }
}