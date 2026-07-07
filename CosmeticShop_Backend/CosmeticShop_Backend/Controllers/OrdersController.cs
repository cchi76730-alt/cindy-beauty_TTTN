using CosmeticShop_Backend.Data;
using CosmeticShop_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmeticShop_Backend.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        public class CreateOrderRequest
        {
            public string CustomerName { get; set; } = string.Empty;
            public string Phone { get; set; } = string.Empty;
            public string Address { get; set; } = string.Empty;
            public string? Email { get; set; }
            public string? Note { get; set; }
            public string PaymentMethod { get; set; } = "COD";
            public List<CreateOrderItemRequest> Items { get; set; } = new();
        }

        public class CreateOrderItemRequest
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal Price { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(
            [FromBody] CreateOrderRequest request
        )
        {
            if (string.IsNullOrWhiteSpace(request.CustomerName))
                return BadRequest("Thiếu tên khách hàng");

            if (string.IsNullOrWhiteSpace(request.Phone))
                return BadRequest("Thiếu số điện thoại");

            if (string.IsNullOrWhiteSpace(request.Address))
                return BadRequest("Thiếu địa chỉ");

            if (request.Items == null || request.Items.Count == 0)
                return BadRequest("Đơn hàng chưa có sản phẩm");

            foreach (var item in request.Items)
            {
                if (item.ProductId <= 0)
                    return BadRequest("ProductId không hợp lệ");

                if (item.Quantity <= 0)
                    return BadRequest("Số lượng sản phẩm không hợp lệ");

                if (item.Price <= 0)
                    return BadRequest("Giá sản phẩm không hợp lệ");
            }

            var productIds = request.Items
                .Select(x => x.ProductId)
                .ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            foreach (var item in request.Items)
            {
                var product = products
                    .FirstOrDefault(p => p.Id == item.ProductId);

                if (product == null)
                {
                    return BadRequest(
                        $"Không tìm thấy sản phẩm ID {item.ProductId}"
                    );
                }

                if (product.Stock < item.Quantity)
                {
                    return BadRequest(
                        $"Sản phẩm {product.Name} không đủ tồn kho. Còn lại: {product.Stock}"
                    );
                }
            }

            var totalAmount = request.Items.Sum(
                x => x.Price * x.Quantity
            );

            var order = new Order
            {
                CustomerName = request.CustomerName,
                Phone = request.Phone,
                Address = request.Address,
                Email = request.Email,
                Note = request.Note,
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = "Unpaid",
                Status = request.PaymentMethod == "Banking"
                    ? "PendingPayment"
                    : "Pending",
                TotalAmount = totalAmount,
                CreatedAt = DateTime.Now,
                OrderDetails = request.Items.Select(x => new OrderDetail
                {
                    ProductId = x.ProductId,
                    Quantity = x.Quantity,
                    Price = x.Price
                }).ToList()
            };

            foreach (var item in request.Items)
            {
                var product = products
                    .First(p => p.Id == item.ProductId);

                product.Stock -= item.Quantity;
            }

            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                order.Id,
                order.CustomerName,
                order.Phone,
                order.Address,
                order.Email,
                order.Note,
                order.TotalAmount,
                order.PaymentMethod,
                order.PaymentStatus,
                order.Status,
                order.CreatedAt,
                TransferContent = $"DH{order.Id}"
            });
        }

        [HttpGet("phone/{phone}")]
        public async Task<IActionResult> GetOrdersByPhone(string phone)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Where(o => o.Phone == phone)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng");

            return Ok(order);
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng");

            if (order.Status != "Shipping")
                return BadRequest("Chỉ đơn đang giao hàng mới có thể xác nhận đã nhận");

            order.Status = "Completed";
            order.CompletedAt = DateTime.Now;
            order.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(order);
        }


    }
}