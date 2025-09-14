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

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual ICollection<EcommerceEvent>? EcommerceEvents { get; set; }
    }
}