using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(IConfigService configService, ILogger<ReviewController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetReviews(string productId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var reviews = await _configService.GetReviewsByProductId(productId, xCorrelationId);
                return Ok(CreateSuccessResponse(reviews));
            }
            catch (Exception ex) { return HandleException(ex, xCorrelationId); }
        }

        [HttpGet("summary/{productId}")]
        public async Task<IActionResult> GetReviewSummary(string productId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var summary = await _configService.GetReviewSummary(productId, xCorrelationId);
                return Ok(CreateSuccessResponse(summary));
            }
            catch (Exception ex) { return HandleException(ex, xCorrelationId); }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SaveReview([FromBody] ReviewRequestModel request)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(CreateErrorResponse("Invalid review data"));

                var id = await _configService.SaveOrUpdateReview(request, xCorrelationId);
                return Ok(CreateSuccessResponse(id));
            }
            catch (Exception ex) { return HandleException(ex, xCorrelationId); }
        }

        [HttpDelete("{reviewId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReview(string reviewId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var success = await _configService.DeleteReview(reviewId, xCorrelationId);
                if (!success) return NotFound(CreateNotFoundResponse("Review not found"));
                return Ok(CreateSuccessResponse("Review deleted"));
            }
            catch (Exception ex) { return HandleException(ex, xCorrelationId); }
        }
    }
}
