using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IConfigService _configService;

        public AuthController(IConfigService configService)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
        }

        [HttpPost("user-login")]
        public async Task<ActionResult<ApiResponseModel>> UserLogin([FromBody] LoginRequestModel model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model), "Login model cannot be null");

            if (!ModelState.IsValid)
                throw new ArgumentException("Invalid model state");

            var correlationId = GetCorrelationId();
            var item = await _configService.UserLogin(model, correlationId);

            if (item == null)
                throw new UnauthorizedAccessException("Invalid credentials provided");

            return Ok(CreateSuccessResponse(item));
        }

        [HttpPost("user-registration")]
        public async Task<ActionResult<ApiResponseModel>> UserRegistration([FromBody] RegistrationRequestModel model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model), "Registration model cannot be null");

            if (!ModelState.IsValid)
                throw new ArgumentException("Invalid model state");

            var correlationId = GetCorrelationId();
            var item = await _configService.UserRegistration(model, correlationId);

            if (item == null)
                throw new InvalidOperationException("Registration failed. User may already exist or invalid data provided");

            return Ok(CreateSuccessResponse(item));
        }

        [HttpGet("user-profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponseModel>> GetUserProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid user token");

            var correlationId = GetCorrelationId();
            var userProfile = await _configService.GetUserProfile(Guid.Parse(userId), correlationId);

            if (userProfile == null)
                return NotFound("User profile not found");

            return Ok(CreateSuccessResponse(userProfile));
        }

        [HttpPut("user-profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponseModel>> UpdateUserProfile([FromBody] RegistrationRequestModel model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model), "Update model cannot be null");

            // Additional validation for profile updates
            if (!model.Id.HasValue)
                throw new ArgumentException("User ID is required for profile updates");

            if (string.IsNullOrWhiteSpace(model.FirstName) || string.IsNullOrWhiteSpace(model.LastName) ||
                string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.MobileNumber))
                throw new ArgumentException("FirstName, LastName, Email, and MobileNumber are required");

            if (!ModelState.IsValid)
                throw new ArgumentException("Invalid model state");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid user token");

            // Ensure the user can only update their own profile
            if (model.Id.Value != Guid.Parse(userId))
                return Forbid("You can only update your own profile");

            var correlationId = GetCorrelationId();
            var updatedProfile = await _configService.UpdateUserProfile(model, correlationId);

            if (updatedProfile == null)
                return NotFound("User profile not found");

            return Ok(CreateSuccessResponse(updatedProfile));
        }
    }
}
