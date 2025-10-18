using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class ResponseStatusModel
    {
        public string ErrorCode { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public string Errors { get; set; }
    }
}
