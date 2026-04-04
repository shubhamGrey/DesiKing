using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class WishlistRequestModel
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid ProductId { get; set; }
    }
}
