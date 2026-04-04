using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<WishlistController> _logger;

        public WishlistController(IConfigService configService, ILogger<WishlistController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> GetWishlist(string userId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var items = await _configService.GetWishlistByUserId(userId, xCorrelationId);
                return Ok(CreateSuccessResponse(items));
            }
            catch (Exception ex) { return HandleException(ex, ex.Message, xCorrelationId); }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistRequestModel request)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                if (!ModelState.IsValid) return BadRequest(CreateErrorResponse("Invalid request"));
                var success = await _configService.AddToWishlist(request, xCorrelationId);
                return Ok(CreateSuccessResponse(success ? "Added to wishlist" : "Already in wishlist"));
            }
            catch (Exception ex) { return HandleException(ex, ex.Message, xCorrelationId); }
        }

        [HttpDelete("{userId}/{productId}")]
        [Authorize]
        public async Task<IActionResult> RemoveFromWishlist(string userId, string productId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var success = await _configService.RemoveFromWishlist(userId, productId, xCorrelationId);
                if (!success) return CreateNotFoundResponse("Wishlist item not found");
                return Ok(CreateSuccessResponse("Removed from wishlist"));
            }
            catch (Exception ex) { return HandleException(ex, ex.Message, xCorrelationId); }
        }

        [HttpGet("check/{userId}/{productId}")]
        [Authorize]
        public async Task<IActionResult> IsInWishlist(string userId, string productId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var inWishlist = await _configService.IsInWishlist(userId, productId, xCorrelationId);
                return Ok(CreateSuccessResponse(inWishlist));
            }
            catch (Exception ex) { return HandleException(ex, ex.Message, xCorrelationId); }
        }
    }
}
