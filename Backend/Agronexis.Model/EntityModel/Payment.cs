using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("Payment", Schema = "dbo")]
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public string TransactionId { get; set; } = "";
        public string Paymentmethod { get; set; } = "";
        public string PaymentStatus { get; set; } = "";
        public int BrandId { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
