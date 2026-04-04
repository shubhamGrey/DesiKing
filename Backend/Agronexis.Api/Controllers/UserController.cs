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

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetUsers()
        {
            string xCorrelationId = GetCorrelationId();
            _logger.LogInformation("GetUsers called, CorrelationId: {CorrelationId}", xCorrelationId);
            try
            {
                var users = _configService.GetUsers(xCorrelationId);
                return Ok(CreateSuccessResponse(users));
            }
            catch (Exception ex)
            {
                return HandleException(ex, xCorrelationId);
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile(Guid id)
        {
            string xCorrelationId = GetCorrelationId();
            _logger.LogInformation("GetUserProfile called for {Id}, CorrelationId: {CorrelationId}", id, xCorrelationId);
            try
            {
                var profile = await _configService.GetUserProfile(id, xCorrelationId);
                return Ok(CreateSuccessResponse(profile));
            }
            catch (Exception ex)
            {
                return HandleException(ex, xCorrelationId);
            }
        }
    }
}
