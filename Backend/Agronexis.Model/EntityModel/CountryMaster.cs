using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("CountryMaster", Schema = "dbo")]
    public class CountryMaster
    {
        [Key]
        [StringLength(5)]
        public string CountryCode { get; set; } = "";

        [Required]
        [StringLength(100)]
        public string CountryName { get; set; } = "";

        public ICollection<StateMaster> States { get; set; } = [];
    }
}
