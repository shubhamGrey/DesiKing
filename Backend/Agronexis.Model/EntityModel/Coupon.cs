using System.ComponentModel.DataAnnotations.Schema;

namespace Agronexis.Model.EntityModel
{
    [Table("Coupon", Schema = "dbo")]
    public class Coupon
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string DiscountType { get; set; }     // "percentage" or "fixed"
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public int? UsageLimit { get; set; }
        public int UsageCount { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
