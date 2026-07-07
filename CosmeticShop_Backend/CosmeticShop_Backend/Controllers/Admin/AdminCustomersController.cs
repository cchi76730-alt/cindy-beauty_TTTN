using CosmeticShop_Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Route("api/admin/customers")]
    [ApiController]
    public class AdminCustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminCustomersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Orders
                .GroupBy(o => new
                {
                    o.Phone,
                    o.CustomerName,
                    o.Email,
                    o.Address
                })
                .Select(g => new
                {
                    id = g.Min(x => x.Id),
                    customerName = g.Key.CustomerName,
                    phone = g.Key.Phone,
                    email = g.Key.Email,
                    address = g.Key.Address,
                    totalOrders = g.Count(),
                    totalSpent = g.Sum(x => x.TotalAmount),
                    latestOrderDate = g.Max(x => x.CreatedAt)
                })
                .OrderByDescending(x => x.latestOrderDate)
                .ToListAsync();

            return Ok(customers);
        }
    }
}