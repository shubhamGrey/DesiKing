using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class ReviewRequestModel
    {
        public Guid? Id { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public Guid? BrandId { get; set; }
    }
}
