using Microsoft.AspNetCore.Mvc;
using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            var emailExists = _context.Users
                .FirstOrDefault(x => x.Email == user.Email);

            if (emailExists != null)
            {
                return BadRequest(new
                {
                    message = "Email đã tồn tại"
                });
            }

            var phoneExists = _context.Users
                .FirstOrDefault(x => x.Phone == user.Phone);

            if (phoneExists != null)
            {
                return BadRequest(new
                {
                    message = "Số điện thoại đã tồn tại"
                });
            }

            _context.Users.Add(user);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Đăng ký thành công"
            });
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(x =>
                (x.Email == request.Identifier ||
                 x.Phone == request.Identifier)
                 &&
                 x.Password == request.Password
            );

            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Sai tài khoản hoặc mật khẩu"
                });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                user
            });
        }

        // ================= GET USERS =================
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_context.Users.ToList());
        }
    }
}