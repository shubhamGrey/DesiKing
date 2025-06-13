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

        public string SaveOrUpdateCategory(CategoryRequestModel product, string xCorrelationId)
        {
            return _repository.SaveOrUpdateCategory(product, xCorrelationId);
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

        public string SaveOrUpdateBrand(BrandRequestModel product, string xCorrelationId)
        {
            return _repository.SaveOrUpdateBrand(product, xCorrelationId);
        }

        public string DeleteBrandById(string id, string xCorrelationId)
        {
            return _repository.DeleteBrandById(id, xCorrelationId);
        }
    }
}
