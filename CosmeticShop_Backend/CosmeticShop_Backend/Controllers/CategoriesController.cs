using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace CosmeticShop_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private static List<Category> categories = new()
        {
            new Category { Id = 1, Name = "Son môi", Icon = "💄" },
            new Category { Id = 2, Name = "Skincare", Icon = "✨" },
            new Category { Id = 3, Name = "Nước hoa", Icon = "🌸" },
            new Category { Id = 4, Name = "Kem chống nắng", Icon = "☀️" },
            new Category { Id = 5, Name = "Makeup", Icon = "🎨" }
        };

        [HttpGet]
        public IActionResult GetCategories()
        {
            return Ok(categories);
        }
    }
}