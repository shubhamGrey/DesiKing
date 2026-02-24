using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class DTDC_ShipmentLabelRequestModel
    {
        public string AwbNo { get; set; }
        public string LabelCode { get; set; }
        public string LabelFormat { get; set; }
    }
}
