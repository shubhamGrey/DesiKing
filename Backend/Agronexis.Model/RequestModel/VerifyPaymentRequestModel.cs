using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class VerifyPaymentRequestModel
    {
        public string? OrderId { get; set; }
        public string? PaymentId { get; set; }
        public string? Signature { get; set; }
        public Guid UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
        public string? PaymentMethod { get; set; } // COD, RAZORPAY
    }
}
