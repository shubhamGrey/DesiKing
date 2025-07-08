using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("Product", Schema = "dbo")]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrls { get; set; }
        public string? KeyFeatures { get; set; }
        public string? Uses { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? Origin { get; set; }
        public string? ShelfLife { get; set; }
        public string? StorageInstructions { get; set; }
        public string? Certifications { get; set; }
        public string? Ingredients { get; set; }
        public string? NutritionalInfo { get; set; }
        public Guid BrandId { get; set; }
        [ForeignKey("Category")]
        public Guid CategoryId { get; set; }
        public DateTime? ManufacturingDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsPremium { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public Category Category { get; set; }
        public ICollection<Inventory> Inventories { get; set; }

    }
}
