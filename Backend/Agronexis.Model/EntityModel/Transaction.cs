using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("Transaction", Schema = "dbo")]
    public class Transaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string? RazorpayPaymentId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public Guid UserId { get; set; }
        public string? Signature { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
        public string? Status { get; set; } //captured, failed, refunded
        public string? PaymentMethod { get; set; }
        public Guid BrandId { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
