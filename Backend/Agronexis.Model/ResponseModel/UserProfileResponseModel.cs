using System;

namespace Agronexis.Model.ResponseModel
{
    public class UserProfileResponseModel
    {
        public Guid Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? MobileNumber { get; set; }
        public Guid RoleId { get; set; }
        public string? RoleName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public Guid BrandId { get; set; }
        public bool IsActive { get; set; }
    }
}
