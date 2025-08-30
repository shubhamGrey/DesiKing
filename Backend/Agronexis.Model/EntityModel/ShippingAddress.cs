using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("ShippingAddress", Schema = "dbo")]
    public class ShippingAddress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? FullName { get; set; } = "";
        public string? PhoneNumber { get; set; } = "";
        public string? AddressLine1 { get; set; } = "";
        public string? AddressLine2 { get; set; } = "";
        public string? City { get; set; } = "";
        public string? ZipCode { get; set; } = "";
        public Guid BrandId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        [StringLength(10)]
        public string? StateCode { get; set; }
        [StringLength(5)]
        public string? CountryCode { get; set; }
        [ForeignKey(nameof(StateCode))]
        public StateMaster? State { get; set; }
        [ForeignKey(nameof(CountryCode))]
        public CountryMaster? Country { get; set; }
    }
}
