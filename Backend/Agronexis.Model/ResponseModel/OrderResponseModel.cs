using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class OrderResponseModel
    {
        public Guid OrderId { get; set; }
        public string? RazorpayOrderId { get; set; }
    }
}
