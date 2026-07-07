using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Route("api/admin/notifications")]
    [ApiController]
    public class AdminNotificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminNotificationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await GetCurrentNotifications();

            var readItems = await _context.AdminNotificationReads
                .ToListAsync();

            var unreadNotifications = notifications
     .Where(n => !readItems.Any(r =>
         r.Type == n.Type &&
         r.TargetId == n.Id
     ))
     .ToList();

            return Ok(new
            {
                count = unreadNotifications.Count,

                notifications = notifications.Select(n => new
                {
                    id = n.Id,
                    type = n.Type,
                    title = n.Title,
                    content = n.Content,
                    createdAt = n.CreatedAt,
                    link = n.Link,
                    isRead = readItems.Any(r =>
                        r.Type == n.Type &&
                        r.TargetId == n.Id
                    )
                })
            });
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var notifications = await GetCurrentNotifications();

            foreach (var item in notifications)
            {
                var exists = await _context.AdminNotificationReads
                    .AnyAsync(x =>
                        x.Type == item.Type &&
                        x.TargetId == item.Id
                    );

                if (!exists)
                {
                    _context.AdminNotificationReads.Add(
                        new AdminNotificationRead
                        {
                            Type = item.Type,
                            TargetId = item.Id,
                            ReadAt = DateTime.Now
                        }
                    );
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã đánh dấu tất cả thông báo là đã đọc"
            });
        }

        [HttpPut("{type}/{id:int}/read")]
        public async Task<IActionResult> MarkOneAsRead(
            string type,
            int id
        )
        {
            var exists = await _context.AdminNotificationReads
                .AnyAsync(x =>
                    x.Type == type &&
                    x.TargetId == id
                );

            if (!exists)
            {
                _context.AdminNotificationReads.Add(
                    new AdminNotificationRead
                    {
                        Type = type,
                        TargetId = id,
                        ReadAt = DateTime.Now
                    }
                );

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Đã đánh dấu thông báo là đã đọc"
            });
        }

        private async Task<List<NotificationDto>> GetCurrentNotifications()
        {
            var orders = await _context.Orders
                .Where(o =>
                    o.Status == "Pending" ||
                    o.Status == "PendingPayment"
                )
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new NotificationDto
                {
                    Id = o.Id,
                    Type = "order",
                    Title = "Đơn hàng mới",
                    Content = $"Đơn DH{o.Id} của {o.CustomerName}",
                    CreatedAt = o.CreatedAt,
                    Link = "/admin/orders"
                })
                .ToListAsync();

            var stock = await _context.Products
                .Where(p => p.Stock <= 10)
                .OrderBy(p => p.Stock)
                .Take(5)
                .Select(p => new NotificationDto
                {
                    Id = p.Id,
                    Type = "stock",
                    Title = "Sắp hết hàng",
                    Content = $"{p.Name} chỉ còn {p.Stock} sản phẩm",
                    CreatedAt = p.CreatedAt,
                    Link = "/admin/inventory"
                })
                .ToListAsync();

            var reviews = await _context.Reviews
                .OrderByDescending(r => r.CreatedAt)
                .Take(5)
                .Select(r => new NotificationDto
                {
                    Id = r.Id,
                    Type = "review",
                    Title = "Đánh giá mới",
                    Content = $"{r.UserName} đã đánh giá {r.Rating} sao",
                    CreatedAt = r.CreatedAt,
                    Link = "/admin/reviews"
                })
                .ToListAsync();

            return orders
                .Concat(stock)
                .Concat(reviews)
                .OrderByDescending(x => x.CreatedAt)
                .Take(10)
                .ToList();
        }

        private class NotificationDto
        {
            public int Id { get; set; }
            public string Type { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public string Link { get; set; } = "/admin";
        }
    }
}