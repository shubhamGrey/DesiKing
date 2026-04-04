namespace Agronexis.Model.ResponseModel
{
    public class ValidateCouponResponse
    {
        public bool IsValid { get; set; }
        public string? ErrorMessage { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public string? CouponCode { get; set; }
    }
}
