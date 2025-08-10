using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class WeightResponseModel
    {
        public Guid Id { get; set; }
        public decimal Value { get; set; }
        public string Unit { get; set; }
    }
}
