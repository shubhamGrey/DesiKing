using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class OrderRequestModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
        public Guid BrandId { get; set; }
        public string? Status { get; set; } = "created";
        public string? PaymentMethod { get; set; } = "COD"; // COD, RAZORPAY
        public List<OrderItemRequestModel> Items { get; set; } = new();
    }
}
