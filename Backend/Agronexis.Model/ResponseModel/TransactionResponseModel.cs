using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class TransactionResponseModel
    {
        public Guid Id { get; set; }
        public string? RazorpayPaymentId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public Guid UserId { get; set; }
        public string? Signature { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
        public string? Status { get; set; } // captured, failed, refunded
        public string? PaymentMethod { get; set; }
        public Guid BrandId { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}