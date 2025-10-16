using Agronexis.Model.EntityModel;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Business.Configurations
{
    public interface IConfigService
    {
        List<ProductResponseModel> GetProducts(string xCorrelationId);
        ProductResponseModel GetProductById(string id, string xCorrelationId);
        List<ProductResponseModel> GetProductsByCategory(string categoryId, string xCorrelationId);
        string SaveOrUpdateProduct(ProductRequestModel product, string xCorrelationId);
        string DeleteProductById(string id, string xCorrelationId);
        List<CategoryResponseModel> GetCategories(string xCorrelationId);
        CategoryResponseModel GetCategoryById(string id, string xCorrelationId);
        string SaveOrUpdateCategory(CategoryRequestModel category, string xCorrelationId);
        string DeleteCategoryById(string id, string xCorrelationId);
        List<BrandResponseModel> GetBrands(string xCorrelationId);
        BrandResponseModel GetBrandById(string id, string xCorrelationId);
        string SaveOrUpdateBrand(BrandRequestModel brand, string xCorrelationId);
        string DeleteBrandById(string id, string xCorrelationId);
        List<RoleResponseModel> GetRoles(string xCorrelationId);
        RoleResponseModel GetRoleById(string id, string xCorrelationId);
        string SaveOrUpdateRole(RoleRequestModel role, string xCorrelationId);
        string DeleteRoleById(string id, string xCorrelationId);
        Task<LoginResponseModel> UserLogin(LoginRequestModel model, string xCorrelationId);
        Task<RegistrationResponseModel> UserRegistration(RegistrationRequestModel model, string xCorrelationId);
        Task<OrderResponseModel> CreateOrder(OrderRequestModel order, string xCorrelationId);
        bool VerifyPayment(VerifyPaymentRequestModel verify, string xCorrelationId);
        Task<UserProfileResponseModel> GetUserProfile(Guid userId, string xCorrelationId);
        Task<RefundPaymentResponseModel> RefundPayment(RefundPaymentRequestModel verify, string xCorrelationId);
        List<CartResponseModel> GetCartItemsByUserId(string id, string xCorrelationId);
        string DeleteCartById(string id, string xCorrelationId);
        string SaveOrUpdateCart(CartRequestModel cart, string xCorrelationId);
        List<CurrencyResponseModel> GetCurrencies(string xCorrelationId);
        List<WeightResponseModel> GetWeights(string xCorrelationId);
        Task<List<StateResponseModel>> GetStates(string countryCode, string xCorrelationId);
        Task<List<CountryResponseModel>> GetCountries(string xCorrelationId);
        List<AddressResponseModel> GetAddressesByUserId(string userId, string correlationId);
        string SaveOrUpdateAddress(AddressRequestModel address, string correlationId);
        string DeleteAddressById(string id, string correlationId);
        List<OrderByUserResponseModel> GetOrdersByUserId(string userId, string correlationId);
        Task<AnalyticsResponseModel> ProcessAnalyticsEvents(AnalyticsPayloadRequest payload, string xCorrelationId);
        Task<UserProfileResponseModel> UpdateUserProfile(RegistrationRequestModel model, string xCorrelationId);

    }
}
