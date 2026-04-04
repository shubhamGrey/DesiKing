using System.Text.Json.Serialization;

namespace Agronexis.Model.RequestModel
{
    public class WishlistRequestModel
    {
        /// <summary>
        /// Set server-side from the JWT claim — not accepted from the client.
        /// </summary>
        [JsonIgnore]
        public Guid UserId { get; set; }

        public Guid ProductId { get; set; }
    }
}
