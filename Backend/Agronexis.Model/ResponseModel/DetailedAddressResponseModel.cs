using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class DetailedAddressResponseModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine { get; set; }
        public string? City { get; set; }
        public string? LandMark { get; set; }
        public string? PinCode { get; set; }
        public string? StateCode { get; set; }
        public string? CountryCode { get; set; }
        public string? AddressType { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}