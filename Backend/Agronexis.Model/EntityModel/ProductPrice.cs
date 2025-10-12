using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("ProductPrice", Schema = "dbo")]
    public class ProductPrice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
        [ForeignKey("Currency")]
        public Guid CurrencyId { get; set; }
        public Currency Currency { get; set; }
        public decimal Price { get; set; }
        public bool IsDiscounted { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountedAmount { get; set; }
        public string? SkuNumber { get; set; }
        [ForeignKey("Weight")]
        public Guid WeightId { get; set; }
        public Weight Weight { get; set; }
        public string? Barcode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
