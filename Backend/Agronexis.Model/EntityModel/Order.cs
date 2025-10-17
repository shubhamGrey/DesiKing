using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("Order", Schema = "dbo")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? ReceiptId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
        public string? Status { get; set; } //created, paid, failed
        public Guid BrandId { get; set; }
        public string? DocketNumber { get; set; } // AWB or tracking number
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = [];
    }
}
