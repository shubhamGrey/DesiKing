using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class ForgotPasswordRequestModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
