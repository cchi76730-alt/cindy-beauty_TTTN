using CosmeticShop_Backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace CosmeticShop_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeautyMatchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BeautyMatchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetBeautyMatch(
            string? skinType,
            string? concern,
            string? priceRange
        )
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(skinType))
            {
                query = query.Where(p =>
                    p.SkinType != null &&
                    p.SkinType.Contains(skinType)
                );
            }

            if (!string.IsNullOrWhiteSpace(concern))
            {
                query = query.Where(p =>
                    p.Concern != null &&
                    p.Concern.Contains(concern)
                );
            }

            if (!string.IsNullOrWhiteSpace(priceRange))
            {
                query = query.Where(p =>
                    p.PriceRange != null &&
                    p.PriceRange.Contains(priceRange)
                );
            }

            var products = query.ToList();

            var advice = GenerateAdvice(skinType, concern);
            var routine = GenerateRoutine(skinType);

            return Ok(new
            {
                products,
                advice,
                routine
            });
        }

        // =======================
        // BEAUTY ADVICE ENGINE
        // =======================
        private string GenerateAdvice(string? skinType, string? concern)
        {
            if (skinType == "da dầu")
                return "Da dầu nên ưu tiên sản phẩm oil-control, texture mỏng nhẹ, tránh dưỡng quá dày.";

            if (skinType == "da khô")
                return "Da khô cần dưỡng ẩm sâu với HA, ceramide để phục hồi hàng rào da.";

            if (skinType == "da nhạy cảm")
                return "Da nhạy cảm nên tránh hương liệu, cồn, ưu tiên sản phẩm dịu nhẹ.";

            if (concern == "mụn")
                return "Nên chọn BHA, salicylic acid để làm sạch lỗ chân lông và giảm mụn.";

            return "Duy trì skincare cơ bản: làm sạch - dưỡng ẩm - chống nắng là đủ cho da khỏe.";
        }

        // =======================
        // SKINCARE ROUTINE ENGINE
        // =======================
        private object GenerateRoutine(string? skinType)
        {
            if (skinType == "da dầu")
            {
                return new
                {
                    morning = new[]
                    {
                        "Sữa rửa mặt tạo bọt nhẹ",
                        "Toner kiềm dầu",
                        "Serum niacinamide",
                        "Kem chống nắng oil-free"
                    },
                    night = new[]
                    {
                        "Tẩy trang",
                        "Sữa rửa mặt",
                        "BHA 2-3 lần/tuần",
                        "Kem dưỡng mỏng nhẹ"
                    }
                };
            }

            if (skinType == "da khô")
            {
                return new
                {
                    morning = new[]
                    {
                        "Sữa rửa mặt dịu nhẹ",
                        "Toner cấp ẩm",
                        "Serum HA",
                        "Kem chống nắng dưỡng ẩm"
                    },
                    night = new[]
                    {
                        "Tẩy trang",
                        "Sữa rửa mặt dịu nhẹ",
                        "Serum phục hồi",
                        "Kem dưỡng ẩm dày"
                    }
                };
            }

            return new
            {
                morning = new[]
                {
                    "Sữa rửa mặt",
                    "Toner cân bằng",
                    "Kem dưỡng",
                    "Kem chống nắng SPF50"
                },
                night = new[]
                {
                    "Tẩy trang",
                    "Sữa rửa mặt",
                    "Serum treatment",
                    "Kem dưỡng phục hồi"
                }
            };
        }
    }
}