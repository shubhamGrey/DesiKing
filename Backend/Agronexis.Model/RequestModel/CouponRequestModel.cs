using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class CouponRequestModel
    {
        public Guid? Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Code { get; set; }

        [Required]
        public string DiscountType { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal DiscountValue { get; set; }

        public decimal MinOrderAmount { get; set; } = 0;
        public int? UsageLimit { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
