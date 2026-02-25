using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class DTDC_TrackingRequestModel
    {
        public string TrkType { get; set; } = "cnno";
        public string Strcnno { get; set; }
        public string AddtnlDtl { get; set; } = "Y";
    }
}
