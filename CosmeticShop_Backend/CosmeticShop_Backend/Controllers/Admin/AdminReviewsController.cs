using CosmeticShop_Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Route("api/admin/reviews")]
    [ApiController]
    public class AdminReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminReviewsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.ProductId,
                    ProductName = r.Product != null ? r.Product.Name : "Không rõ sản phẩm",
                    ProductImage = r.Product != null ? r.Product.ImageUrl : "",
                    r.UserName,
                    r.UserEmail,
                    r.Comment,
                    r.Rating,
                    r.MediaUrl,
                    r.MediaType,
                    r.IsHidden,
                    r.IsSpam,
                    r.AdminReply,
                    r.CreatedAt,
                    r.UpdatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPut("{id:int}/hide")]
        public async Task<IActionResult> ToggleHide(int id)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
                return NotFound("Không tìm thấy đánh giá");

            review.IsHidden = !review.IsHidden;
            review.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(review);
        }

        [HttpPut("{id:int}/spam")]
        public async Task<IActionResult> ToggleSpam(int id)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
                return NotFound("Không tìm thấy đánh giá");

            review.IsSpam = !review.IsSpam;
            review.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(review);
        }

        public class ReplyRequest
        {
            public string Reply { get; set; } = string.Empty;
        }

        [HttpPut("{id:int}/reply")]
        public async Task<IActionResult> ReplyReview(
            int id,
            [FromBody] ReplyRequest request
        )
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
                return NotFound("Không tìm thấy đánh giá");

            if (string.IsNullOrWhiteSpace(request.Reply))
                return BadRequest("Nội dung phản hồi không được trống");

            review.AdminReply = request.Reply;
            review.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(review);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
                return NotFound("Không tìm thấy đánh giá");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa đánh giá thành công"
            });
        }
    }
}