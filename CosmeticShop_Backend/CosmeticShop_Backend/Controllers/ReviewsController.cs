using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/reviews/product/1
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.Id)
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<IActionResult> CreateReview(
     [FromBody] Review review)
        {
            if (review == null)
            {
                return BadRequest("Review null");
            }

            if (review.ProductId <= 0)
            {
                return BadRequest("ProductId không hợp lệ");
            }

            if (string.IsNullOrWhiteSpace(review.UserName))
            {
                return BadRequest("Thiếu UserName");
            }

            if (string.IsNullOrWhiteSpace(review.Comment))
            {
                return BadRequest("Thiếu Comment");
            }

            review.CreatedAt = DateTime.Now;

            _context.Reviews.Add(review);

            await _context.SaveChangesAsync();

            return Ok(review);
        }
    }
}