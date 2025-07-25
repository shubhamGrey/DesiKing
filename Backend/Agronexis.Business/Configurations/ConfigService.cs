using Agronexis.DataAccess.ConfigurationsRepository;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.Extensions.Logging;

namespace Agronexis.Business.Configurations
{
    public class ConfigService : IConfigService
    {
        private readonly IConfigurationRepository _repository;
        private readonly ILogger<ConfigService> _logger;

        public ConfigService(IConfigurationRepository repository, ILogger<ConfigService> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public List<ProductResponseModel> GetProducts(string xCorrelationId)
        {
            try
            {
                _logger.LogInformation("Getting products for correlation ID: {CorrelationId}", xCorrelationId);
                var result = _repository.GetProducts(xCorrelationId);
                _logger.LogInformation("Successfully retrieved {Count} products for correlation ID: {CorrelationId}", result?.Count ?? 0, xCorrelationId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products for correlation ID: {CorrelationId}", xCorrelationId);
                throw;
            }
        }

        public ProductResponseModel GetProductById(string id, string xCorrelationId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    throw new ArgumentException("Product ID cannot be null or empty", nameof(id));

                _logger.LogInformation("Getting product by ID: {Id} for correlation ID: {CorrelationId}", id, xCorrelationId);
                var result = _repository.GetProductById(id, xCorrelationId);
                _logger.LogInformation("Successfully retrieved product by ID: {Id} for correlation ID: {CorrelationId}", id, xCorrelationId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by ID: {Id} for correlation ID: {CorrelationId}", id, xCorrelationId);
                throw;
            }
        }

        public List<ProductResponseModel> GetProductsByCategory(string categoryId, string xCorrelationId)
        {
            return _repository.GetProductsByCategory(categoryId, xCorrelationId);
        }

        public string SaveOrUpdateProduct(ProductRequestModel product, string xCorrelationId)
        {
            return _repository.SaveOrUpdateProduct(product, xCorrelationId);
        }
        public string DeleteProductById(string id, string xCorrelationId)
        {
            return _repository.DeleteProductById(id, xCorrelationId);
        }

        public List<CategoryResponseModel> GetCategories(string xCorrelationId)
        {
            return _repository.GetCategories(xCorrelationId);
        }

        public CategoryResponseModel GetCategoryById(string id, string xCorrelationId)
        {
            return _repository.GetCategoryById(id, xCorrelationId);
        }

        public string SaveOrUpdateCategory(CategoryRequestModel category, string xCorrelationId)
        {
            return _repository.SaveOrUpdateCategory(category, xCorrelationId);
        }

        public string DeleteCategoryById(string id, string xCorrelationId)
        {
            return _repository.DeleteCategoryById(id, xCorrelationId);
        }

        public List<BrandResponseModel> GetBrands(string xCorrelationId)
        {
            return _repository.GetBrands(xCorrelationId);
        }

        public BrandResponseModel GetBrandById(string id, string xCorrelationId)
        {
            return _repository.GetBrandById(id, xCorrelationId);
        }

        public string SaveOrUpdateBrand(BrandRequestModel brand, string xCorrelationId)
        {
            return _repository.SaveOrUpdateBrand(brand, xCorrelationId);
        }

        public string DeleteBrandById(string id, string xCorrelationId)
        {
            return _repository.DeleteBrandById(id, xCorrelationId);
        }

        public List<RoleResponseModel> GetRoles(string xCorrelationId)
        {
            return _repository.GetRoles(xCorrelationId);
        }

        public RoleResponseModel GetRoleById(string id, string xCorrelationId)
        {
            return _repository.GetRoleById(id, xCorrelationId);
        }

        public string SaveOrUpdateRole(RoleRequestModel role, string xCorrelationId)
        {
            return _repository.SaveOrUpdateRole(role, xCorrelationId);
        }

        public string DeleteRoleById(string id, string xCorrelationId)
        {
            return _repository.DeleteRoleById(id, xCorrelationId);
        }

        public async Task<LoginResponseModel> UserLogin(LoginRequestModel model, string xCorrelationId)
        {
            return await _repository.UserLogin(model, xCorrelationId);
        }
        public async Task<RegistrationResponseModel> UserRegistration(RegistrationRequestModel model, string xCorrelationId)
        {
            return await _repository.UserRegistration(model, xCorrelationId);
        }
        public async Task<OrderResponseModel> CreateOrder(OrderRequestModel order, string xCorrelationId)
        {
            return await _repository.CreateOrder(order, xCorrelationId);
        }
        public bool VerifyPayment(VerifyPaymentRequestModel verify, string xCorrelationId)
        {
            return _repository.VerifyPayment(verify, xCorrelationId);
        }

        public async Task<UserProfileResponseModel> GetUserProfile(Guid userId, string xCorrelationId)
        {
            try
            {
                _logger.LogInformation("Getting user profile for user ID: {UserId}, correlation ID: {CorrelationId}", userId, xCorrelationId);
                var result = await _repository.GetUserProfile(userId, xCorrelationId);
                _logger.LogInformation("Successfully retrieved user profile for user ID: {UserId}, correlation ID: {CorrelationId}", userId, xCorrelationId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile for user ID: {UserId}, correlation ID: {CorrelationId}", userId, xCorrelationId);
                throw;
            }
        }

        public RefundPaymentResponseModel RefundPayment(RefundPaymentRequestModel refund, string xCorrelationId)
        {
            return _repository.RefundPayment(refund, xCorrelationId);
        }
        public CartResponseModel GetCartItemsByUserId(string id, string xCorrelationId)
        {
            return _repository.GetCartItemsByUserId(id, xCorrelationId);
        }
        public string DeleteCartById(string id, string xCorrelationId)
        {
            return _repository.DeleteCartById(id, xCorrelationId);
        }
        public string SaveOrUpdateCart(CartRequestModel role, string xCorrelationId)
        {
            return _repository.SaveOrUpdateCart(role, xCorrelationId);
        }
    }
}
