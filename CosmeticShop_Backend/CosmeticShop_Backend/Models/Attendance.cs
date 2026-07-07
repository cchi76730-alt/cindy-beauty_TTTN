using System.ComponentModel.DataAnnotations;

namespace CosmeticShop_Backend.Models
{
    public class Attendance
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public Employee? Employee { get; set; }

        public DateTime CheckInTime { get; set; } = DateTime.Now;

        public DateTime? CheckOutTime { get; set; }

        public string Status { get; set; } = "Working";
        // Working / Completed

        public string? Note { get; set; }

        public double TotalHours
        {
            get
            {
                if (CheckOutTime == null) return 0;

                return Math.Round(
                    (CheckOutTime.Value - CheckInTime).TotalHours,
                    2
                );
            }
        }
    }
}