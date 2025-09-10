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
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
        public DateTime? CreatedDate { get; set; }
        public List<OrderItemResponseModel> OrderItems { get; set; } = [];
    }
}
