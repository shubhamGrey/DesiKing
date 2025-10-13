using System;
using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class RegistrationRequestModel
    {
        // Optional for profile updates, required for registration (validation handled in controller)
        public Guid? Id { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone(ErrorMessage = "Invalid mobile number format")]
        [StringLength(15, ErrorMessage = "Mobile number cannot exceed 15 characters")]
        public string MobileNumber { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters")]
        public string? UserName { get; set; }

        // Only required for registration, not for profile updates
        public string? Password { get; set; }

        // Only used for registration, not for profile updates
        public Guid? RoleId { get; set; }
    }
}
