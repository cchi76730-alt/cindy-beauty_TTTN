using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Route("api/admin/messages")]
    [ApiController]
    public class AdminMessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminMessageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.AdminMessages
                .OrderByDescending(m => m.CreatedAt)
                .Take(20)
                .ToListAsync();

            var unreadCount = await _context.AdminMessages
                .CountAsync(m => !m.IsRead);

            return Ok(new
            {
                count = unreadCount,
                messages
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(
            [FromBody] AdminMessage message
        )
        {
            if (string.IsNullOrWhiteSpace(message.SenderName))
                return BadRequest("Thiếu tên người gửi");

            if (string.IsNullOrWhiteSpace(message.Content))
                return BadRequest("Thiếu nội dung tin nhắn");

            message.CreatedAt = DateTime.Now;
            message.IsRead = false;

            _context.AdminMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        [HttpGet("customer")]
        public async Task<IActionResult> GetCustomerMessages(
            [FromQuery] string? email,
            [FromQuery] string? phone
        )
        {
            if (string.IsNullOrWhiteSpace(email) &&
                string.IsNullOrWhiteSpace(phone))
            {
                return BadRequest("Thiếu email hoặc số điện thoại");
            }

            var query = _context.AdminMessages.AsQueryable();

            query = query.Where(m =>
                (!string.IsNullOrWhiteSpace(email) &&
                    m.SenderEmail == email)
                ||
                (!string.IsNullOrWhiteSpace(phone) &&
                    m.SenderPhone == phone)
            );

            var messages = await query
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPut("{id:int}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var message = await _context.AdminMessages.FindAsync(id);

            if (message == null)
                return NotFound();

            message.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(message);
        }

        [HttpPut("{id:int}/reply")]
        public async Task<IActionResult> ReplyMessage(
            int id,
            [FromBody] string reply
        )
        {
            var message = await _context.AdminMessages.FindAsync(id);

            if (message == null)
                return NotFound("Không tìm thấy tin nhắn");

            if (string.IsNullOrWhiteSpace(reply))
                return BadRequest("Nội dung trả lời không được trống");

            message.AdminReply = reply;
            message.RepliedAt = DateTime.Now;
            message.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(message);
        }
    }
}