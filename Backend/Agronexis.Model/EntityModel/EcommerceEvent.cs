using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Agronexis.Model.EntityModel
{
    [Table("EcommerceEvents")]
    public class EcommerceEvent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public long AnalyticsEventId { get; set; }

        [StringLength(100)]
        public string? TransactionId { get; set; }

        [StringLength(10)]
        public string? Currency { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalValue { get; set; }

        public string? ItemsData { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //// Navigation property
        //[ForeignKey("AnalyticsEventId")]
        //public virtual AnalyticsEvent? AnalyticsEvent { get; set; }
    }
}