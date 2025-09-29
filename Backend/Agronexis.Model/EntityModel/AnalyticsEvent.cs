using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Agronexis.Model.EntityModel
{
    [Table("AnalyticsEvents")]
    public class AnalyticsEvent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public Guid EventId { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string EventName { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; }

        [StringLength(500)]
        public string? Label { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Value { get; set; }

        [Required]
        public long Timestamp { get; set; }

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        [StringLength(100)]
        public string SessionId { get; set; }

        [StringLength(100)]
        public string? UserId { get; set; }

        public string? CustomData { get; set; }

        public string? UserAgent { get; set; }

        [StringLength(500)]
        public string? PageUrl { get; set; }

        [StringLength(500)]
        public string? ReferrerUrl { get; set; }

        // Enhanced User and Location Details
        [StringLength(45)]
        public string? IpAddress { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(100)]
        public string? Region { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(50)]
        public string? TimeZone { get; set; }

        [StringLength(10)]
        public string? Language { get; set; }

        // Device Information (stored as JSON)
        public string? DeviceInfo { get; set; }

        // Session Information (stored as JSON)
        public string? SessionInfo { get; set; }

        // User Profile Information (stored as JSON)
        public string? UserProfileInfo { get; set; }

        // Enhanced Event Context
        [StringLength(500)]
        public string? PageReferrer { get; set; }

        public int? ScrollDepth { get; set; }

        public long? TimeOnPage { get; set; }

        [StringLength(200)]
        public string? InteractionTarget { get; set; }

        [StringLength(100)]
        public string? EventSource { get; set; }

        // Element Attributes (stored as JSON)
        public string? ElementAttributes { get; set; }

        // Performance Data (stored as JSON)
        public string? PerformanceData { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual ICollection<EcommerceEvent>? EcommerceEvents { get; set; }
    }
}