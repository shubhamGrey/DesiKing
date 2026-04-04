using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetWishlist()
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(CreateErrorResponse("Invalid user token"));

                var items = await _configService.GetWishlistByUserId(userId, xCorrelationId);
                return Ok(CreateSuccessResponse(items));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to retrieve wishlist", xCorrelationId); }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistRequestModel request)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                if (!ModelState.IsValid) return BadRequest(CreateErrorResponse("Invalid request"));

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(CreateErrorResponse("Invalid user token"));

                if (!Guid.TryParse(userId, out var userGuid))
                    return Unauthorized(CreateErrorResponse("Invalid user token"));

                request.UserId = userGuid;

                var success = await _configService.AddToWishlist(request, xCorrelationId);
                return Ok(CreateSuccessResponse(success ? "Added to wishlist" : "Already in wishlist"));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to add to wishlist", xCorrelationId); }
        }

        [HttpDelete("{productId}")]
        [Authorize]
        public async Task<IActionResult> RemoveFromWishlist(string productId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(CreateErrorResponse("Invalid user token"));

                var success = await _configService.RemoveFromWishlist(userId, productId, xCorrelationId);
                if (!success) return CreateNotFoundResponse("Wishlist item not found");
                return Ok(CreateSuccessResponse("Removed from wishlist"));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to remove from wishlist", xCorrelationId); }
        }

        [HttpGet("check/{productId}")]
        [Authorize]
        public async Task<IActionResult> IsInWishlist(string productId)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(CreateErrorResponse("Invalid user token"));

                var inWishlist = await _configService.IsInWishlist(userId, productId, xCorrelationId);
                return Ok(CreateSuccessResponse(inWishlist));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to check wishlist", xCorrelationId); }
        }
    }
}
