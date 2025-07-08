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
        public List<Price> Prices { get; set; } = [];
        public List<Sku> SkuList { get; set; } = [];
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
    }

    public class Price
    {
        public int Amount { get; set; }
        public string? Currency { get; set; }
        public bool IsDiscounted { get; set; }
        public int DiscountPercentage { get; set; }
        public int DiscountedAmount { get; set; }
        public string? Weight { get; set; }
    }

    public class Sku
    {
        public string? SkuNumber { get; set; }
        public string? Weight { get; set; }
        public string? Barcode { get; set; }
    }
}
