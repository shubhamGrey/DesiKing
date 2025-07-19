using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<ProductController> _logger;

        public ProductController(IConfigService configService, ILogger<ProductController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/product
        [HttpGet]
        public ActionResult<IEnumerable<ProductResponseModel>> GetProducts()
        {
            _logger.LogInformation("GetProducts endpoint called");

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing GetProducts for correlation ID: {CorrelationId}", correlationId);

            var itemList = _configService.GetProducts(correlationId);
            if (itemList == null)
            {
                _logger.LogWarning("No products found for correlation ID: {CorrelationId}", correlationId);
                throw new KeyNotFoundException("No products found");
            }

            _logger.LogInformation("Successfully retrieved {Count} products for correlation ID: {CorrelationId}", itemList.Count(), correlationId);
            return Ok(itemList);
        }

        // GET api/product/{id}
        [HttpGet("{id}")]
        public ActionResult<ProductResponseModel> GetProductById(string id)
        {
            _logger.LogInformation("GetProductById endpoint called with id: {Id}", id);

            if (string.IsNullOrWhiteSpace(id))
            {
                _logger.LogWarning("GetProductById called with null or empty id");
                throw new ArgumentException("Product ID cannot be null or empty", nameof(id));
            }

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing GetProductById for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);

            var item = _configService.GetProductById(id, correlationId);
            if (item == null)
            {
                _logger.LogWarning("Product not found for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
                throw new KeyNotFoundException($"Product with ID {id} not found");
            }

            _logger.LogInformation("Successfully retrieved product for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
            return Ok(item);
        }

        // GET api/product/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public ActionResult<IEnumerable<ProductResponseModel>> GetProductsByCategory(string categoryId)
        {
            _logger.LogInformation("GetProductsByCategory endpoint called with categoryId: {CategoryId}", categoryId);

            if (string.IsNullOrWhiteSpace(categoryId))
            {
                _logger.LogWarning("GetProductsByCategory called with null or empty categoryId");
                throw new ArgumentException("Category ID cannot be null or empty", nameof(categoryId));
            }

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing GetProductsByCategory for categoryId: {CategoryId}, correlation ID: {CorrelationId}", categoryId, correlationId);

            var items = _configService.GetProductsByCategory(categoryId, correlationId);
            if (items == null || !items.Any())
            {
                _logger.LogWarning("No products found for categoryId: {CategoryId}, correlation ID: {CorrelationId}", categoryId, correlationId);
                throw new KeyNotFoundException($"No products found for category {categoryId}");
            }

            _logger.LogInformation("Successfully retrieved {Count} products for categoryId: {CategoryId}, correlation ID: {CorrelationId}", items.Count(), categoryId, correlationId);
            return Ok(items);
        }

        // POST api/product
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateProduct([FromBody] ProductRequestModel product)
        {
            _logger.LogInformation("SaveOrUpdateProduct endpoint called");

            if (product == null)
            {
                _logger.LogWarning("SaveOrUpdateProduct called with null product");
                throw new ArgumentNullException(nameof(product), "Product cannot be null");
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("SaveOrUpdateProduct called with invalid model state");
                throw new ArgumentException("Invalid model state");
            }

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing SaveOrUpdateProduct for correlation ID: {CorrelationId}", correlationId);

            var item = _configService.SaveOrUpdateProduct(product, correlationId);
            if (item == null)
            {
                _logger.LogWarning("SaveOrUpdateProduct failed for correlation ID: {CorrelationId}", correlationId);
                throw new InvalidOperationException("Failed to save or update product");
            }

            _logger.LogInformation("SaveOrUpdateProduct successful for correlation ID: {CorrelationId}", correlationId);
            return Ok(CreateSuccessResponse(item));
        }

        // DELETE api/product/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteProduct(string id)
        {
            _logger.LogInformation("DeleteProduct endpoint called with id: {Id}", id);

            if (string.IsNullOrWhiteSpace(id))
            {
                _logger.LogWarning("DeleteProduct called with null or empty id");
                throw new ArgumentException("Product ID cannot be null or empty", nameof(id));
            }

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing DeleteProduct for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);

            var item = _configService.DeleteProductById(id, correlationId);
            if (item == null)
            {
                _logger.LogWarning("DeleteProduct failed for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
                throw new KeyNotFoundException($"Product with ID {id} not found or could not be deleted");
            }

            _logger.LogInformation("DeleteProduct successful for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
            return Ok(CreateSuccessResponse(item));
        }
    }
}
