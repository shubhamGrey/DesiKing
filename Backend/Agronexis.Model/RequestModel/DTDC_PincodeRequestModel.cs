using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class DTDC_PincodeRequestModel
    {
        [JsonPropertyName("orgPincode")]
        public string OrgPincode { get; set; }

        [JsonPropertyName("desPincode")]
        public string DesPincode { get; set; }
    }
}
