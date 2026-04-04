using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class ResetPasswordRequestModel
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; }
    }
}
