using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class ProductRequestModel
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public string Currency { get; set; } = "INR";
        public List<string> KeyFeatures { get; set; } = [];
        public List<string> Uses { get; set; } = [];
        public string? CategoryId { get; set; }
        public DateTime ManufacturingDate { get; set; }
    }
}
