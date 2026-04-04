using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Agronexis.Model.EntityModel
{
    [Table("Wishlist", Schema = "dbo")]
    public class Wishlist
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
