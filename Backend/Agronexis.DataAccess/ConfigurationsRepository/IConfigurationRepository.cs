using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.DataAccess.ConfigurationsRepository
{
    public interface IConfigurationRepository
    {
        List<ProductResponseModel> GetProducts(string xCorrelationId);
        ProductResponseModel GetProductById(string id, string xCorrelationId);
        string SaveOrUpdateProduct(ProductRequestModel product, string xCorrelationId);
        string DeleteProductById(string id, string xCorrelationId);
        List<CategoryResponseModel> GetCategories(string xCorrelationId);
        CategoryResponseModel GetCategoryById(string id, string xCorrelationId);
        string SaveOrUpdateCategory(CategoryRequestModel product, string xCorrelationId);
        string DeleteCategoryById(string id, string xCorrelationId);
    }
}
