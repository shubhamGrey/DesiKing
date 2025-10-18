using Agronexis.Model.EntityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class OrderByUserResponseModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? ReceiptId { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
        public string? DocketNumber { get; set; }
        public DateTime? CreatedDate { get; set; }
        public List<OrderItemResponseModel> OrderItems { get; set; } = [];
        public TransactionResponseModel? Transaction { get; set; }
        public DetailedAddressResponseModel? ShippingAddress { get; set; }
        public DetailedAddressResponseModel? BillingAddress { get; set; }
    }
}
