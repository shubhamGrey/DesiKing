using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("StateMaster", Schema = "dbo")]
    public class StateMaster
    {
        [Key]
        [StringLength(10)]
        public string StateCode { get; set; } = "";

        [Required]
        [StringLength(100)]
        public string StateName { get; set; } = "";

        [Required]
        [StringLength(5)]
        public string CountryCode { get; set; } = "";

        [ForeignKey(nameof(CountryCode))]
        public CountryMaster Country { get; set; } = null!;
    }
}
