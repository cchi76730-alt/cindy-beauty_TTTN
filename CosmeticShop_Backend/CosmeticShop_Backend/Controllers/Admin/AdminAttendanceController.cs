using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [Authorize(Roles = "Admin,Staff,Warehouse")]
    [Route("api/admin/attendance")]
    [ApiController]
    public class AdminAttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminAttendanceController(AppDbContext context)
        {
            _context = context;
        }

        private string GetCurrentEmail()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value ?? "";
        }

        private string GetCurrentRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? "";
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendances()
        {
            var email = GetCurrentEmail();
            var role = GetCurrentRole();

            var query = _context.Attendances
                .Include(a => a.Employee)
                .OrderByDescending(a => a.CheckInTime)
                .AsQueryable();

            if (role != "Admin")
            {
                query = query.Where(a => a.Employee != null &&
                                         a.Employee.Email == email);
            }

            var data = await query
                .Select(a => new
                {
                    a.Id,
                    a.EmployeeId,
                    EmployeeName = a.Employee != null ? a.Employee.FullName : "Không rõ",
                    EmployeeEmail = a.Employee != null ? a.Employee.Email : "",
                    EmployeeRole = a.Employee != null ? a.Employee.Role : "",
                    a.CheckInTime,
                    a.CheckOutTime,
                    a.Status,
                    a.Note,
                    a.TotalHours
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayStatus()
        {
            var email = GetCurrentEmail();
            var role = GetCurrentRole();

            if (role == "Admin")
            {
                return Ok(new
                {
                    message = "Admin không cần chấm công",
                    attendance = (object?)null
                });
            }

            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == email);

            if (employee == null)
            {
                return Ok(new
                {
                    message = "Không tìm thấy nhân viên",
                    attendance = (object?)null
                });
            }

            var today = DateTime.Today;

            var attendance = await _context.Attendances
                .Where(a =>
                    a.EmployeeId == employee.Id &&
                    a.CheckInTime.Date == today
                )
                .OrderByDescending(a => a.CheckInTime)
                .FirstOrDefaultAsync();

            return Ok(new
            {
                employee.Id,
                employee.FullName,
                employee.Email,
                employee.Role,
                attendance
            });
        }

        [HttpPost("check-in")]
        public async Task<IActionResult> CheckIn()
        {
            var email = GetCurrentEmail();

            var employee = await _context.Employees
                .FirstOrDefaultAsync(e =>
                    e.Email == email &&
                    e.IsActive == true
                );

            if (employee == null)
                return NotFound("Không tìm thấy nhân viên hoặc tài khoản đã bị khóa");

            var today = DateTime.Today;

            var workingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a =>
                    a.EmployeeId == employee.Id &&
                    a.CheckInTime.Date == today &&
                    a.Status == "Working"
                );

            if (workingAttendance != null)
                return BadRequest("Bạn đã chấm công vào ca rồi");

            var attendance = new Attendance
            {
                EmployeeId = employee.Id,
                CheckInTime = DateTime.Now,
                Status = "Working"
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Chấm công vào ca thành công",
                attendance
            });
        }

        [HttpPut("check-out")]
        public async Task<IActionResult> CheckOut()
        {
            var email = GetCurrentEmail();

            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == email);

            if (employee == null)
                return NotFound("Không tìm thấy nhân viên");

            var today = DateTime.Today;

            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a =>
                    a.EmployeeId == employee.Id &&
                    a.CheckInTime.Date == today &&
                    a.Status == "Working"
                );

            if (attendance == null)
                return BadRequest("Bạn chưa chấm công vào ca");

            attendance.CheckOutTime = DateTime.Now;
            attendance.Status = "Completed";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Chấm công ra ca thành công",
                attendance
            });
        }
    }
}