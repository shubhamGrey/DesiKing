using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class PickupBookingResponseModel
    {
        public int ErrorCode { get; set; }
        public string Message { get; set; }
        public bool Status { get; set; }
        public string Errors { get; set; }
    }
}
