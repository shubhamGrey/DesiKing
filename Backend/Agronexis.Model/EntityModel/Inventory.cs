using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("Inventory", Schema = "dbo")]
    public class Inventory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public int ExpiryInDays { get; set; }
        public Guid CategoryId { get; set; }
        public int LifeCycle { get; set; }
        public int BackOrder { get; set; }
        public int BrandId { get; set; }
        public DateTime ManufacturingDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public Product Product { get; set; }
    }
}
