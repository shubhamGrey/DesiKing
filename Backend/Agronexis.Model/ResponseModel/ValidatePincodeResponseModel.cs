using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class ValidatePincodeResponseModel
    {
        public bool IsServiceable { get; set; }
        public string Message { get; set; }
        public object RawResponse { get; set; }
    }
}
