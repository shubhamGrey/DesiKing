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
    }
}
