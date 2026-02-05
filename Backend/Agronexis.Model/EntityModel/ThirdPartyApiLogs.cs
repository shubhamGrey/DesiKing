using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.EntityModel
{
    [Table("ThirdPartyApiLogs", Schema = "dbo")]
    public class ThirdPartyApiLogs
    {
        public Guid Id { get; set; }
        public string? ProviderName { get; set; }          // DTDC
        public string? ApiName { get; set; }               // CreateShipment
        public string? CustomerReferenceNumber { get; set; }
        public int? HttpStatusCode { get; set; }
        public bool? IsSuccess { get; set; }               // derived from response
        public string? Reason { get; set; }                // WRONG_INPUT, CONSIGNMENT_ALREADY_EXISTS
        [Column(TypeName = "jsonb")]
        public string? RequestJson { get; set; }           // FULL request payload
        [Column(TypeName = "jsonb")]
        public string? ResponseJson { get; set; }          // FULL response payload
        public string? CorrelationId { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
