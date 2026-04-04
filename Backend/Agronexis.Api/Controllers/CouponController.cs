using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<CouponController> _logger;

        public CouponController(IConfigService configService, ILogger<CouponController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponRequest request)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                if (!ModelState.IsValid) return BadRequest(CreateErrorResponse("Invalid request"));
                var result = await _configService.ValidateCoupon(request, xCorrelationId);
                if (!result.IsValid) return BadRequest(CreateErrorResponse(result.ErrorMessage ?? "Invalid coupon"));
                return Ok(CreateSuccessResponse(result));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to validate coupon", xCorrelationId); }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllCoupons()
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var coupons = await _configService.GetAllCoupons(xCorrelationId);
                return Ok(CreateSuccessResponse(coupons));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to retrieve coupons", xCorrelationId); }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SaveOrUpdateCoupon([FromBody] CouponRequestModel request)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                if (!ModelState.IsValid) return BadRequest(CreateErrorResponse("Invalid coupon data"));
                var id = await _configService.SaveOrUpdateCoupon(request, xCorrelationId);
                return Ok(CreateSuccessResponse(id));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to save coupon", xCorrelationId); }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCoupon(string id)
        {
            string xCorrelationId = GetCorrelationId();
            try
            {
                var success = await _configService.DeleteCoupon(id, xCorrelationId);
                if (!success) return CreateNotFoundResponse("Coupon not found");
                return Ok(CreateSuccessResponse("Coupon deleted"));
            }
            catch (Exception ex) { return HandleException(ex, "Failed to delete coupon", xCorrelationId); }
        }
    }
}
