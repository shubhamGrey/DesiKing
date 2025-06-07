using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class ApiResponseModel
    {
        public ApiResponseInfoModel Info { get; set; }
        public string Id { get; set; }
        public object Data { get; set; }

    }

    public class ApiResponseInfoModel
    {
        public bool IsSuccess { get; set; } = true;
        public string Code { get; set; }
        public string Message { get; set; }
    }
}
