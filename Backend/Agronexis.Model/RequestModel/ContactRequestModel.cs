using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class ContactRequestModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? PhoneNumber { get; set; }

        [Required]
        public string Message { get; set; }
    }
}
