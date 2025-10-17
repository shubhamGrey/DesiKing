using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class ShipmentLabelResponseModel
    {
        public string AwbNo { get; set; }
        public string FileUrl { get; set; }
        public ResponseStatusModel ResponseStatus { get; set; }
    }
}

