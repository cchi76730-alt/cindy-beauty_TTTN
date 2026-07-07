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
        private readonly IWebHostEnvironment _env;

        public ReviewsController(
            AppDbContext context,
            IWebHostEnvironment env
        )
        {
            _context = context;
            _env = env;
        }

        // GET: api/reviews/product/1
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId && !r.IsHidden)
                .OrderByDescending(r => r.Id)
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<IActionResult> CreateReview(
            [FromForm] int productId,
            [FromForm] string userName,
            [FromForm] string? userEmail,
            [FromForm] int rating,
            [FromForm] string comment,
            IFormFile? media
        )
        {
            if (productId <= 0)
                return BadRequest("ProductId không hợp lệ");

            if (string.IsNullOrWhiteSpace(userName))
                return BadRequest("Thiếu UserName");

            if (string.IsNullOrWhiteSpace(comment))
                return BadRequest("Thiếu Comment");

            if (rating < 1 || rating > 5)
                return BadRequest("Rating phải từ 1 đến 5");

            var productExists = await _context.Products
                .AnyAsync(p => p.Id == productId);

            if (!productExists)
                return BadRequest("Sản phẩm không tồn tại");

            var review = new Review
            {
                ProductId = productId,
                UserName = userName,
                UserEmail = userEmail,
                Rating = rating,
                Comment = comment,
                CreatedAt = DateTime.Now
            };

            if (media != null)
            {
                var allowedImageTypes = new[]
                {
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/gif"
                };

                var allowedVideoTypes = new[]
                {
                    "video/mp4",
                    "video/webm",
                    "video/quicktime"
                };

                var isImage = allowedImageTypes.Contains(media.ContentType);
                var isVideo = allowedVideoTypes.Contains(media.ContentType);

                if (!isImage && !isVideo)
                    return BadRequest("Chỉ cho phép upload ảnh hoặc video");

                var webRootPath = _env.WebRootPath;

                if (string.IsNullOrEmpty(webRootPath))
                {
                    webRootPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot"
                    );
                }

                var folderName = "reviews";
                var folderPath = Path.Combine(webRootPath, folderName);

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var fileName =
                    Guid.NewGuid() +
                    Path.GetExtension(media.FileName);

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await media.CopyToAsync(stream);
                }

                review.MediaUrl =
                    $"https://localhost:7019/{folderName}/{fileName}";

                review.MediaType = isImage ? "image" : "video";
            }

            _context.Reviews.Add(review);

            await _context.SaveChangesAsync();

            return Ok(review);
        }
    }
}