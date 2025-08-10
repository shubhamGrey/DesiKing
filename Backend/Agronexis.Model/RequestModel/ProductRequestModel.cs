using Agronexis.Model.EntityModel;
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
        public List<PriceRequestModel> PricesAndSkus { get; set; } = [];
        public List<string> ImageUrls { get; set; } = [];
        public List<string> KeyFeatures { get; set; } = [];
        public List<string> Uses { get; set; } = [];
        public DateTime ManufacturingDate { get; set; }
        public Guid CategoryId { get; set; }
        public Guid BrandId { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? Origin { get; set; }
        public string? ShelfLife { get; set; }
        public string? StorageInstructions { get; set; }
        public List<string> Certifications { get; set; } = [];
        public bool IsActive { get; set; }
        public bool IsPremium { get; set; }
        public bool IsFeatured { get; set; }
        public string? Ingredients { get; set; }
        public string? NutritionalInfo { get; set; }
        public string? ThumbnailUrl { get; set; }
    }
}
