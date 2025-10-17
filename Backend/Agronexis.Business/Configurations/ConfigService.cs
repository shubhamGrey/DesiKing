using Agronexis.DataAccess.ConfigurationsRepository;
using Agronexis.Model.EntityModel;
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
            return _repository.GetProducts(xCorrelationId);
        }

        public ProductResponseModel GetProductById(string id, string xCorrelationId)
        {
            return _repository.GetProductById(id, xCorrelationId);
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
            return await _repository.GetUserProfile(userId, xCorrelationId);
        }

        public async Task<RefundPaymentResponseModel> RefundPayment(RefundPaymentRequestModel refund, string xCorrelationId)
        {
            return await _repository.RefundPayment(refund, xCorrelationId);
        }
        public List<CartResponseModel> GetCartItemsByUserId(string id, string xCorrelationId)
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
        public List<CurrencyResponseModel> GetCurrencies(string xCorrelationId)
        {
            return _repository.GetCurrencies(xCorrelationId);
        }
        public List<WeightResponseModel> GetWeights(string xCorrelationId)
        {
            return _repository.GetWeights(xCorrelationId);
        }
        public Task<List<StateResponseModel>> GetStates(string countryCode, string xCorrelationId)
        {
            return _repository.GetStates(countryCode, xCorrelationId);
        }
        public Task<List<CountryResponseModel>> GetCountries(string xCorrelationId)
        {
            return _repository.GetCountries(xCorrelationId);
        }
        public List<AddressResponseModel> GetAddressesByUserId(string userId, string xCorrelationId)
        {
            return _repository.GetAddressesByUserId(userId, xCorrelationId);
        }

        public string SaveOrUpdateAddress(AddressRequestModel address, string xCorrelationId)
        {
            return _repository.SaveOrUpdateAddress(address, xCorrelationId);
        }

        public string DeleteAddressById(string id, string xCorrelationId)
        {
            return _repository.DeleteAddressById(id, xCorrelationId);
        }
        public List<OrderByUserResponseModel> GetOrdersByUserId(string userId, string xCorrelationId)
        {
            return _repository.GetOrdersByUserId(userId, xCorrelationId);
        }

        public async Task<AnalyticsResponseModel> ProcessAnalyticsEvents(AnalyticsPayloadRequest payload, string xCorrelationId)
        {
            return await _repository.ProcessAnalyticsEvents(payload, xCorrelationId);
        }
        public async Task<ShipmentTrackingResponseModel> TrackShipment(string awbNo, string xCorrelationId)
        {
            return await _repository.TrackShipment(awbNo, xCorrelationId);
        }
        public async Task<ShipmentLabelResponseModel> GenerateShipmentLabel(string awbNo, string xCorrelationId)
        {
            return await _repository.GenerateShipmentLabel(awbNo, xCorrelationId);
        }
        public async Task<PickupBookingResponseModel> CreatePickupBooking(PickupBookingRequestModel request, string xCorrelationId)
        {
            return await _repository.CreatePickupBooking(request, xCorrelationId);
        }

    }
}
