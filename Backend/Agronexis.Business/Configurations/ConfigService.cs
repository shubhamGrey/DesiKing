using Agronexis.DataAccess.ConfigurationsRepository;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Business.Configurations
{
    public class ConfigService : IConfigService
    {
        private readonly IConfigurationRepository _repository;
        public ConfigService(IConfigurationRepository repository)
        {
            _repository = repository;
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
        public string CreateOrder(OrderRequestModel order, string xCorrelationId)
        {
            return _repository.CreateOrder(order, xCorrelationId);
        }
    }
}
