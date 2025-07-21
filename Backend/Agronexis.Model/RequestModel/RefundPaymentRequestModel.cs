using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class RefundPaymentRequestModel
    {
        public string? PaymentId { get; set; }
        public int AmountInPaise { get; set; }
        public string? OrderId { get; set; }
        public string? Signature { get; set; }
        public Guid UserId { get; set; }
        public string? Currency { get; set; }
        public string? PaymentMethod { get; set; } // COD, RAZORPAY
    }
}
