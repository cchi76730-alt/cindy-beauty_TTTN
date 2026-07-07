using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/conversations")]
    [ApiController]
    public class ConversationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConversationsController(AppDbContext context)
        {
            _context = context;
        }

        public class CreateConversationRequest
        {
            public string CustomerName { get; set; } = string.Empty;
            public string? CustomerEmail { get; set; }
            public string? CustomerPhone { get; set; }
            public int? ProductId { get; set; }
            public string? ProductName { get; set; }
            public string Content { get; set; } = string.Empty;
        }

        public class SendMessageRequest
        {
            public string SenderType { get; set; } = "customer";
            public string Content { get; set; } = string.Empty;
        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var conversations = await _context.Conversations
                .Include(c => c.Messages)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();

            var unreadCount = conversations
                .SelectMany(c => c.Messages)
                .Count(m =>
                    m.SenderType == "customer" &&
                    m.IsRead == false
                );

            return Ok(new
            {
                count = unreadCount,
                conversations
            });
        }

        [HttpGet("customer")]
        public async Task<IActionResult> GetCustomerConversations(
            [FromQuery] string? email,
            [FromQuery] string? phone
        )
        {
            if (string.IsNullOrWhiteSpace(email) &&
                string.IsNullOrWhiteSpace(phone))
            {
                return BadRequest("Thiếu email hoặc số điện thoại");
            }

            var conversations = await _context.Conversations
                .Include(c => c.Messages)
                .Where(c =>
                    (!string.IsNullOrWhiteSpace(email) &&
                     c.CustomerEmail == email)
                    ||
                    (!string.IsNullOrWhiteSpace(phone) &&
                     c.CustomerPhone == phone)
                )
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();

            return Ok(conversations);
        }

        [HttpPost]
        public async Task<IActionResult> CreateConversation(
            [FromBody] CreateConversationRequest request
        )
        {
            if (string.IsNullOrWhiteSpace(request.CustomerName))
                return BadRequest("Thiếu tên khách hàng");

            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Thiếu nội dung tin nhắn");

            var conversation = new Conversation
            {
                CustomerName = request.CustomerName,
                CustomerEmail = request.CustomerEmail,
                CustomerPhone = request.CustomerPhone,
                ProductId = request.ProductId,
                ProductName = request.ProductName,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Messages = new List<ConversationMessage>
                {
                    new ConversationMessage
                    {
                        SenderType = "customer",
                        Content = request.Content,
                        IsRead = false,
                        CreatedAt = DateTime.Now
                    }
                }
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            return Ok(conversation);
        }

        [HttpPost("{conversationId:int}/messages")]
        public async Task<IActionResult> SendMessage(
            int conversationId,
            [FromBody] SendMessageRequest request
        )
        {
            var conversation = await _context.Conversations
                .FindAsync(conversationId);

            if (conversation == null)
                return NotFound("Không tìm thấy cuộc trò chuyện");

            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Nội dung không được trống");

            var message = new ConversationMessage
            {
                ConversationId = conversationId,
                SenderType = request.SenderType,
                Content = request.Content,
                IsRead = request.SenderType == "admin",
                CreatedAt = DateTime.Now
            };

            conversation.UpdatedAt = DateTime.Now;

            _context.ConversationMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        [HttpPut("admin/read-all")]
        public async Task<IActionResult> MarkAllAsReadByAdmin()
        {
            var unreadMessages = await _context.ConversationMessages
                .Where(m =>
                    m.SenderType == "customer" &&
                    m.IsRead == false
                )
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã đánh dấu tất cả tin nhắn là đã đọc"
            });
        }

        [HttpPut("admin/{conversationId:int}/read")]
        public async Task<IActionResult> MarkConversationAsReadByAdmin(
            int conversationId
        )
        {
            var unreadMessages = await _context.ConversationMessages
                .Where(m =>
                    m.ConversationId == conversationId &&
                    m.SenderType == "customer" &&
                    m.IsRead == false
                )
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã đánh dấu cuộc trò chuyện là đã đọc"
            });
        }
    }
}