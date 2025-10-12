using Agronexis.Model.EntityModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class PriceRequestModel
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid CurrencyId { get; set; }
        public decimal Price { get; set; }
        public bool IsDiscounted { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountedAmount { get; set; }
        public string? SkuNumber { get; set; }
        public Guid WeightId { get; set; }
        public string? Barcode { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
