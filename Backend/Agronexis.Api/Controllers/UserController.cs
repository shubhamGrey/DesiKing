using Agronexis.Business.Configurations;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<UserController> _logger;

        public UserController(IConfigService configService, ILogger<UserController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/User
        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<UserProfileResponseModel>> GetUsers()
        {
            try
            {
                _logger.LogInformation("GetUsers endpoint called");

                var correlationId = GetCorrelationId();
                var userList = _configService.GetUsers(correlationId);

                _logger.LogInformation("Successfully retrieved {Count} users with correlation ID: {CorrelationId}",
                    userList?.Count() ?? 0, correlationId);

                return Ok(userList);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while retrieving users with correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to retrieve users", correlationId);
            }
        }

        // GET api/User/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileResponseModel>> GetUserProfile(Guid id)
        {
            try
            {
                _logger.LogInformation("GetUserProfile endpoint called for user ID: {UserId}", id);

                var correlationId = GetCorrelationId();
                var user = await _configService.GetUserProfile(id, correlationId);

                if (user == null)
                {
                    _logger.LogWarning("User not found with ID: {UserId}, correlation ID: {CorrelationId}", id, correlationId);
                    return NotFound($"User with ID {id} not found");
                }

                _logger.LogInformation("Successfully retrieved user profile for ID: {UserId} with correlation ID: {CorrelationId}",
                    id, correlationId);

                return Ok(user);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while retrieving user profile for ID: {UserId} with correlation ID: {CorrelationId}", 
                    id, correlationId);
                return HandleException(ex, "Failed to retrieve user profile", correlationId);
            }
        }
    }
}