using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/employees")]
    public class AdminEmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminEmployeesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _context.Employees
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(employees);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Employee employee)
        {
            if (string.IsNullOrWhiteSpace(employee.FullName))
                return BadRequest("Tên nhân viên không được để trống");

            if (string.IsNullOrWhiteSpace(employee.Email))
                return BadRequest("Email không được để trống");

            var emailExists = await _context.Employees
                .AnyAsync(x => x.Email == employee.Email);

            if (emailExists)
                return BadRequest("Email đã tồn tại");

            employee.CreatedAt = DateTime.Now;
            employee.IsActive = true;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employee model)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound("Không tìm thấy nhân viên");

            employee.FullName = model.FullName;
            employee.Email = model.Email;
            employee.Phone = model.Phone;
            employee.Role = model.Role;

            if (!string.IsNullOrWhiteSpace(model.Password))
                employee.Password = model.Password;

            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound("Không tìm thấy nhân viên");

            employee.IsActive = !employee.IsActive;

            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound("Không tìm thấy nhân viên");

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa nhân viên thành công"
            });
        }
    }
}