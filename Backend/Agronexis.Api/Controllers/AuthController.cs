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
        private readonly ILogger<AuthController> _logger;

        public AuthController(IConfigService configService, ILogger<AuthController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("user-login")]
        public async Task<ActionResult<ApiResponseModel>> UserLogin([FromBody] LoginRequestModel model)
        {
            _logger.LogInformation("UserLogin endpoint called");

            if (model == null)
            {
                _logger.LogWarning("UserLogin called with null model");
                throw new ArgumentNullException(nameof(model), "Login model cannot be null");
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("UserLogin called with invalid model state");
                throw new ArgumentException("Invalid model state");
            }

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing login for correlation ID: {CorrelationId}", correlationId);

            var item = await _configService.UserLogin(model, correlationId);
            if (item == null)
            {
                _logger.LogWarning("Login failed for correlation ID: {CorrelationId}", correlationId);
                throw new UnauthorizedAccessException("Invalid credentials provided");
            }

            _logger.LogInformation("Login successful for correlation ID: {CorrelationId}", correlationId);
            return Ok(CreateSuccessResponse(item));
        }

        [HttpPost("user-registration")]
        public async Task<ActionResult<ApiResponseModel>> UserRegistration([FromBody] RegistrationRequestModel model)
        {
            _logger.LogInformation("UserRegistration endpoint called");

            if (model == null)
            {
                _logger.LogWarning("UserRegistration called with null model");
                throw new ArgumentNullException(nameof(model), "Registration model cannot be null");
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("UserRegistration called with invalid model state");
                throw new ArgumentException("Invalid model state");
            }

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing registration for correlation ID: {CorrelationId}", correlationId);

            var item = await _configService.UserRegistration(model, correlationId);
            if (item == null)
            {
                _logger.LogWarning("Registration failed for correlation ID: {CorrelationId}", correlationId);
                throw new InvalidOperationException("Registration failed. User may already exist or invalid data provided");
            }

            _logger.LogInformation("Registration successful for correlation ID: {CorrelationId}", correlationId);
            return Ok(CreateSuccessResponse(item));
        }

        [HttpGet("user-profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponseModel>> GetUserProfile()
        {
            _logger.LogInformation("GetUserProfile endpoint called");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("GetUserProfile called without valid user ID");
                return Unauthorized("Invalid user token");
            }

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing user profile request for user ID: {UserId}, correlation ID: {CorrelationId}", userId, correlationId);

            var userProfile = await _configService.GetUserProfile(Guid.Parse(userId), correlationId);
            if (userProfile == null)
            {
                _logger.LogWarning("User profile not found for user ID: {UserId}, correlation ID: {CorrelationId}", userId, correlationId);
                return NotFound("User profile not found");
            }

            _logger.LogInformation("User profile retrieved successfully for user ID: {UserId}, correlation ID: {CorrelationId}", userId, correlationId);
            return Ok(CreateSuccessResponse(userProfile));
        }
    }
}
