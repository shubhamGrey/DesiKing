using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class PriceResponseModel
    {
        public Guid Id { get; set; }
        public decimal Price { get; set; }
        public bool IsDiscounted { get; set; }
        public int DiscountPercentage { get; set; }
        public int DiscountedAmount { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
