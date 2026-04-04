using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class ValidateCouponRequest
    {
        [Required]
        public string Code { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal OrderAmount { get; set; }
    }
}
