namespace Agronexis.Model.ResponseModel
{
    public class ReviewResponseModel
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
