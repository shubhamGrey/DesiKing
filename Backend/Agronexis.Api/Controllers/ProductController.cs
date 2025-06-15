using Agronexis.Business.Configurations;
using Agronexis.Model;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IConfigService _configService;
        string XCorrelationID = string.Empty;
        // private readonly IMemoryCache memoryCache;

        public ProductController(IConfigService configService)
        {
            _configService = configService;
            // this.memoryCache = memoryCache;
        }

        // GET api/product
        [HttpGet]
        public ActionResult<IEnumerable<ProductResponseModel>> GetProducts()
        {
            SetXCorrelationId();
            var itemList = _configService.GetProducts(XCorrelationID);
            return itemList;
        }

        // GET api/product/{id}
        [HttpGet("{id}")]
        public ActionResult<ProductResponseModel> GetProductById(string id)
        {
            SetXCorrelationId();
            var item = _configService.GetProductById(id, XCorrelationID);
            return item;
        }

        // POST api/product
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateProduct([FromBody] ProductRequestModel product)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.SaveOrUpdateProduct(product, XCorrelationID);
            if (item == null)
            {
                response.Info.Code = ((int)ServerStatusCodes.NotFound).ToString();
                response.Info.Message = ApiResponseMessage.DATANOTFOUND;
            }
            else
            {
                response.Info.Code = ((int)ServerStatusCodes.Ok).ToString();
                response.Info.Message = ApiResponseMessage.SUCCESS;
                response.Data = item;
            }
            return response;
        }

        // DELETE api/product/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteProduct(string id)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.DeleteProductById(id, XCorrelationID);
            if (item == null)
            {
                response.Info.Code = ((int)ServerStatusCodes.NotFound).ToString();
                response.Info.Message = ApiResponseMessage.DATANOTFOUND;
            }
            else
            {
                response.Info.Code = ((int)ServerStatusCodes.Ok).ToString();
                response.Info.Message = ApiResponseMessage.SUCCESS;
                response.Data = item;
            }
            return response;
        }

        private void SetXCorrelationId()
        {
            if (Request != null)
            {
                XCorrelationID = (!string.IsNullOrEmpty(Convert.ToString(Request.Headers["X-Correlation-ID"]))) ? Convert.ToString(Request.Headers["X-Correlation-ID"]) : Convert.ToString(Guid.NewGuid());
            }
            else
            {
                XCorrelationID = Convert.ToString(Guid.NewGuid());
            }
        }
    }
}
