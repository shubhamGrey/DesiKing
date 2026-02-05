using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class DTDC_CreateShipmentResponseModel
    {
        public string status { get; set; }
        public List<DtdcData> data { get; set; }
    }

    public class DtdcData
    {
        public bool success { get; set; }
        public string reason { get; set; }
        public string message { get; set; }
        public string reference_number { get; set; }
        public string customer_reference_number { get; set; }
    }
}
