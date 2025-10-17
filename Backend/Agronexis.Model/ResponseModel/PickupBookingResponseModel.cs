using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class PickupBookingResponseModel
    {
        public string DocketNo { get; set; } // example: "50005555555" (Trackon returns docket number)
        public ResponseStatusModel ResponseStatus { get; set; }
    }
}
