using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(IConfigService configService, ILogger<CategoryController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/Category
        [HttpGet]
        public ActionResult<IEnumerable<CategoryResponseModel>> GetCategories()
        {
            _logger.LogInformation("GetCategories endpoint called");

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing GetCategories for correlation ID: {CorrelationId}", correlationId);

            var itemList = _configService.GetCategories(correlationId);
            if (itemList == null)
            {
                _logger.LogWarning("No categories found for correlation ID: {CorrelationId}", correlationId);
                throw new KeyNotFoundException("No categories found");
            }

            _logger.LogInformation("Successfully retrieved {Count} categories for correlation ID: {CorrelationId}", itemList.Count(), correlationId);
            return Ok(itemList);
        }

        // GET api/Category/{id}
        [HttpGet("{id}")]
        public ActionResult<CategoryResponseModel> GetCategoryById(string id)
        {
            _logger.LogInformation("GetCategoryById endpoint called with id: {Id}", id);

            ValidateNotNullOrEmpty(id, nameof(id));

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing GetCategoryById for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);

            var item = _configService.GetCategoryById(id, correlationId);
            if (item == null)
            {
                _logger.LogWarning("Category not found for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
                throw new KeyNotFoundException($"Category with ID {id} not found");
            }

            _logger.LogInformation("Successfully retrieved category for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
            return Ok(item);
        }

        // POST api/Category
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateCategory([FromBody] CategoryRequestModel category)
        {
            _logger.LogInformation("SaveOrUpdateCategory endpoint called");

            ValidateNotNull(category, nameof(category));
            ValidateModel();

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing SaveOrUpdateCategory for correlation ID: {CorrelationId}", correlationId);

            var item = _configService.SaveOrUpdateCategory(category, correlationId);
            if (item == null)
            {
                _logger.LogWarning("SaveOrUpdateCategory failed for correlation ID: {CorrelationId}", correlationId);
                throw new InvalidOperationException("Failed to save or update category");
            }

            _logger.LogInformation("SaveOrUpdateCategory successful for correlation ID: {CorrelationId}", correlationId);
            return Ok(CreateSuccessResponse(item));
        }

        // DELETE api/Category/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteCategory(string id)
        {
            _logger.LogInformation("DeleteCategory endpoint called with id: {Id}", id);

            ValidateNotNullOrEmpty(id, nameof(id));

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing DeleteCategory for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);

            var item = _configService.DeleteCategoryById(id, correlationId);
            if (item == null)
            {
                _logger.LogWarning("DeleteCategory failed for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
                throw new KeyNotFoundException($"Category with ID {id} not found or could not be deleted");
            }

            _logger.LogInformation("DeleteCategory successful for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
            return Ok(CreateSuccessResponse(item));
        }
    }
}
