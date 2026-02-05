using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class DTDC_CancelConsignmentRequestModel
    {
        public List<string> AWBNo { get; set; }
        public string CustomerCode { get; set; }
    }
}
