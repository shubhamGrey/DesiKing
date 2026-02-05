using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class DtdcTokenResponseModel
    {
        public bool IsSuccess { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
        public object RawResponse { get; set; }
    }
}
