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
        public string? Image { get; set; }
        public List<string> KeyFeatures { get; set; } = [];
        public List<string> Uses { get; set; } = [];
        public decimal Price { get; set; }
        public DateTime ManufacturingDate { get; set; }
        public string? Category { get; set; }
        public string? CategoryImage { get; set; }
    }
}
