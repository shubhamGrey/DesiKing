using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Agronexis.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<RoleController> _logger;

        public RoleController(IConfigService configService, ILogger<RoleController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/Role
        // [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<RoleResponseModel>> GetRoles()
        {
            try
            {
                _logger.LogInformation("GetRoles endpoint called");

                var correlationId = GetCorrelationId();
                var itemList = _configService.GetRoles(correlationId);

                _logger.LogInformation("Successfully retrieved {Count} roles with correlation ID: {CorrelationId}",
                    itemList?.Count() ?? 0, correlationId);

                return Ok(itemList);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while retrieving roles with correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to retrieve roles", correlationId);
            }
        }

        // GET api/Role/{id}
        [HttpGet("{id}")]
        // [Authorize]
        public ActionResult<RoleResponseModel> GetRoleById(string id)
        {
            try
            {
                _logger.LogInformation("GetRoleById endpoint called with ID: {RoleId}", id);

                if (string.IsNullOrWhiteSpace(id))
                {
                    _logger.LogWarning("GetRoleById called with null or empty ID");
                    return CreateBadRequestResponse("Role ID is required", GetCorrelationId());
                }

                var correlationId = GetCorrelationId();
                var item = _configService.GetRoleById(id, correlationId);

                if (item == null)
                {
                    _logger.LogWarning("Role not found with ID: {RoleId}, correlation ID: {CorrelationId}", id, correlationId);
                    return CreateNotFoundResponse("Role not found", correlationId);
                }

                _logger.LogInformation("Successfully retrieved role with ID: {RoleId}, correlation ID: {CorrelationId}", id, correlationId);
                return Ok(item);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while retrieving role with ID: {RoleId}, correlation ID: {CorrelationId}", id, correlationId);
                return HandleException(ex, "Failed to retrieve role", correlationId);
            }
        }

        // POST api/Role
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateRole([FromBody] RoleRequestModel role)
        {
            try
            {
                _logger.LogInformation("SaveOrUpdateRole endpoint called");

                if (role == null)
                {
                    _logger.LogWarning("SaveOrUpdateRole called with null role data");
                    return CreateBadRequestResponse("Role data is required", GetCorrelationId());
                }

                var correlationId = GetCorrelationId();
                var item = _configService.SaveOrUpdateRole(role, correlationId);

                if (item == null)
                {
                    _logger.LogWarning("Failed to save or update role, correlation ID: {CorrelationId}", correlationId);
                    return CreateNotFoundResponse("Failed to save or update role", correlationId);
                }

                _logger.LogInformation("Successfully saved or updated role with correlation ID: {CorrelationId}", correlationId);
                return CreateSuccessResponseAction(item, "Role saved successfully", correlationId);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while saving or updating role with correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to save or update role", correlationId);
            }
        }

        // DELETE api/Role/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteRole(string id)
        {
            try
            {
                _logger.LogInformation("DeleteRole endpoint called with ID: {RoleId}", id);

                if (string.IsNullOrWhiteSpace(id))
                {
                    _logger.LogWarning("DeleteRole called with null or empty ID");
                    return CreateBadRequestResponse("Role ID is required", GetCorrelationId());
                }

                var correlationId = GetCorrelationId();
                var item = _configService.DeleteRoleById(id, correlationId);

                if (item == null)
                {
                    _logger.LogWarning("Failed to delete role with ID: {RoleId}, correlation ID: {CorrelationId}", id, correlationId);
                    return CreateNotFoundResponse("Role not found or could not be deleted", correlationId);
                }

                _logger.LogInformation("Successfully deleted role with ID: {RoleId}, correlation ID: {CorrelationId}", id, correlationId);
                return CreateSuccessResponseAction(item, "Role deleted successfully", correlationId);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while deleting role with ID: {RoleId}, correlation ID: {CorrelationId}", id, correlationId);
                return HandleException(ex, "Failed to delete role", correlationId);
            }
        }
    }
}
