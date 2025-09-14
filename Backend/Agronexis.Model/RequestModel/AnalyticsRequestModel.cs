using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class AnalyticsPayloadRequest
    {
        [Required]
        public List<AnalyticsEventRequest> Events { get; set; } = new();

        [Required]
        public long Timestamp { get; set; }

        public string? UserAgent { get; set; }

        public string? Url { get; set; }
    }

    public class AnalyticsEventRequest
    {
        [Required]
        [StringLength(100)]
        public string Event { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; }

        [StringLength(500)]
        public string? Label { get; set; }

        public decimal? Value { get; set; }

        [Required]
        public long Timestamp { get; set; }

        [Required]
        [StringLength(100)]
        public string SessionId { get; set; }

        [StringLength(100)]
        public string? UserId { get; set; }

        public Dictionary<string, object>? CustomData { get; set; }

        // Ecommerce specific
        [StringLength(100)]
        public string? TransactionId { get; set; }

        [StringLength(10)]
        public string? Currency { get; set; }

        public List<EcommerceItemRequest>? Items { get; set; }
    }

    public class EcommerceItemRequest
    {
        [StringLength(100)]
        public string? ItemId { get; set; }

        [StringLength(200)]
        public string? ItemName { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        [StringLength(100)]
        public string? Brand { get; set; }

        [StringLength(100)]
        public string? Variant { get; set; }
    }
}