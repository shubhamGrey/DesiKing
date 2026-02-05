using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class DTDC_CancelConsignmentResponseModel
    {
        public string Status { get; set; }
        public bool Success { get; set; }
        public List<CancelConsignmentDetail> SuccessConsignments { get; set; }
    }
    public class CancelConsignmentDetail
    {
        public bool Success { get; set; }
        public string Reference_Number { get; set; }
        public string ErrorMessage { get; set; }
    }
}
