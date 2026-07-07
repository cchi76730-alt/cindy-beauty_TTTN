using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Authorize(Roles = "Admin,Staff")]
    [Route("api/admin/orders")]
    [ApiController]
    public class AdminOrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminOrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] string status
        )
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng");

            if (status == "Paid")
            {
                order.PaymentStatus = "Paid";
                order.Status = "Confirmed";
            }
            else if (status == "Confirmed")
            {
                order.Status = "Confirmed";
            }
            else if (status == "Shipping")
            {
                order.Status = "Shipping";
            }
            else if (status == "Completed")
            {
                order.Status = "Completed";
                order.CompletedAt = DateTime.Now;
            }
            else if (status == "Cancelled")
            {
                order.Status = "Cancelled";
            }
            else
            {
                return BadRequest("Trạng thái không hợp lệ");
            }

            order.UpdatedAt = DateTime.Now;

            string title = "";
            string content = "";

            if (status == "Paid")
            {
                title = "Đơn hàng đã thanh toán";
                content = $"Đơn hàng DH{order.Id} đã được xác nhận thanh toán.";
            }
            else if (status == "Confirmed")
            {
                title = "Đơn hàng đã được xác nhận";
                content = $"Đơn hàng DH{order.Id} đã được cửa hàng xác nhận.";
            }
            else if (status == "Shipping")
            {
                title = "Đơn hàng đang giao";
                content = $"Đơn hàng DH{order.Id} đang được giao đến bạn.";
            }
            else if (status == "Completed")
            {
                title = "Đơn hàng đã hoàn thành";
                content = $"Đơn hàng DH{order.Id} đã hoàn thành. Cảm ơn bạn đã mua hàng.";
            }
            else if (status == "Cancelled")
            {
                title = "Đơn hàng đã bị hủy";
                content = $"Đơn hàng DH{order.Id} đã bị hủy.";
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                _context.CustomerNotifications.Add(
                    new CustomerNotification
                    {
                        CustomerEmail = order.Email,
                        CustomerPhone = order.Phone,
                        Title = title,
                        Content = content,
                        Type = "order",
                        Link = "/my-orders",
                        IsRead = false,
                        CreatedAt = DateTime.Now
                    }
                );
            }

            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}