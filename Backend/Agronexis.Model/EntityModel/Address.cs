using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("Address", Schema = "dbo")]
    public class Address
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine { get; set; }
        public string? City { get; set; }
        public string? PinCode { get; set; }
        public string? StateCode { get; set; }
        public string? CountryCode { get; set; }
        public string? AddressType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        [ForeignKey(nameof(StateCode))]
        public StateMaster? State { get; set; }
        [ForeignKey(nameof(CountryCode))]
        public CountryMaster? Country { get; set; }
    }
}
