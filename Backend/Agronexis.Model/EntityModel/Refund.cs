using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("Refund", Schema = "dbo")]
    public class Refund
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string? RazorpayRefundId { get; set; }
        public Guid TransactionId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; } //processed, failed
        public DateTime? CreatedDate { get; set; }
    }
}
