using CosmeticShop_Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/customer-notifications")]
    [ApiController]
    public class CustomerNotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerNotificationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications(
            [FromQuery] string? email,
            [FromQuery] string? phone
        )
        {
            if (string.IsNullOrWhiteSpace(email) &&
                string.IsNullOrWhiteSpace(phone))
            {
                return BadRequest("Thiếu email hoặc số điện thoại");
            }

            var notifications = await _context.CustomerNotifications
                .Where(x =>
                    (!string.IsNullOrWhiteSpace(email) &&
                     x.CustomerEmail == email)
                    ||
                    (!string.IsNullOrWhiteSpace(phone) &&
                     x.CustomerPhone == phone)
                )
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(new
            {
                count = notifications.Count(x => !x.IsRead),
                notifications
            });
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification =
                await _context.CustomerNotifications.FindAsync(id);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(notification);
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead(
            [FromQuery] string? email,
            [FromQuery] string? phone
        )
        {
            var notifications = await _context.CustomerNotifications
                .Where(x =>
                    (!string.IsNullOrWhiteSpace(email) &&
                     x.CustomerEmail == email)
                    ||
                    (!string.IsNullOrWhiteSpace(phone) &&
                     x.CustomerPhone == phone)
                )
                .ToListAsync();

            foreach (var item in notifications)
            {
                item.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}