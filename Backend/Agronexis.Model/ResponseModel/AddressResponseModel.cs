using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class AddressResponseModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string FullAddress { get; set; }
    }
}
