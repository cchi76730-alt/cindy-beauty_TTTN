using Microsoft.AspNetCore.Mvc;
using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using CosmeticShop_Backend.DTOs;
using CosmeticShop_Backend.Services;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public AuthController(
            AppDbContext context,
            IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        private string GenerateOtp()
        {
            Random random = new Random();

            return random.Next(100000, 999999).ToString();
        }
        // ================= REGISTER =================
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu đăng ký không hợp lệ"
                });
            }

            user.FullName = user.FullName?.Trim() ?? "";
            user.Phone = user.Phone?.Trim() ?? "";
            user.Email = user.Email?.Trim().ToLower() ?? "";
            user.Password = user.Password?.Trim() ?? "";
            user.Gender = user.Gender?.Trim() ?? "male";

            if (string.IsNullOrWhiteSpace(user.FullName))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập họ tên"
                });
            }

            if (string.IsNullOrWhiteSpace(user.Phone))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập số điện thoại"
                });
            }

            if (string.IsNullOrWhiteSpace(user.Email))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập email"
                });
            }

            if (string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập mật khẩu"
                });
            }

            if (user.Password.Length < 6)
            {
                return BadRequest(new
                {
                    message = "Mật khẩu phải từ 6 ký tự"
                });
            }

            var emailExists = _context.Users
                .Any(x => x.Email.ToLower() == user.Email);

            if (emailExists)
            {
                return BadRequest(new
                {
                    message = "Email đã được đăng ký"
                });
            }

            var phoneExists = _context.Users
                .Any(x => x.Phone == user.Phone);

            if (phoneExists)
            {
                return BadRequest(new
                {
                    message = "Số điện thoại đã được đăng ký"
                });
            }

            user.CreatedAt = DateTime.Now;

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Đăng ký thành công"
            });
        }

        // ================= LOGIN =================
        // ================= LOGIN =================
        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var identifier = request.Identifier
                ?.Trim()
                .ToLower() ?? "";

            var user = _context.Users.FirstOrDefault(x =>
                x.Email.ToLower() == identifier
                ||
                x.Phone == identifier
            );

            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Tài khoản không tồn tại"
                });
            }

            if (user.Password != request.Password)
            {
                return BadRequest(new
                {
                    message = "Mật khẩu không chính xác"
                });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                user
            });
        }

        [HttpPost("send-otp")]
       


        // ================= RESET PASSWORD =================
        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordRequest request)
        {
            var phone = request.Phone.Trim();

            var user = _context.Users
                .FirstOrDefault(x => x.Phone == phone);

            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Số điện thoại chưa đăng ký"
                });
            }

            if (string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new
                {
                    message = "Mật khẩu mới không được trống"
                });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new
                {
                    message = "Mật khẩu phải từ 6 ký tự"
                });
            }

            user.Password = request.NewPassword.Trim();

            _context.SaveChanges();

            return Ok(new
            {
                message = "Đổi mật khẩu thành công"
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