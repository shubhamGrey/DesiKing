namespace Agronexis.Model.ResponseModel
{
    public class ReviewSummaryResponseModel
    {
        public Guid ProductId { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public Dictionary<int, int> RatingBreakdown { get; set; } = new();
    }
}
