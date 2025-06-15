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
    public class BrandController : ControllerBase
    {
        private readonly IConfigService _configService;
        string XCorrelationID = string.Empty;

        public BrandController(IConfigService configService)
        {
            _configService = configService;
        }

        // GET api/Brand
        [HttpGet]
        public ActionResult<IEnumerable<BrandResponseModel>> GetBrands()
        {
            SetXCorrelationId();
            var itemList = _configService.GetBrands(XCorrelationID);
            return itemList;
        }

        // GET api/Brand/{id}
        [HttpGet("{id}")]
        public ActionResult<BrandResponseModel> GetBrandById(string id)
        {
            SetXCorrelationId();
            var item = _configService.GetBrandById(id, XCorrelationID);
            return item;
        }

        // POST api/Brand
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateBrand([FromBody] BrandRequestModel Brand)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.SaveOrUpdateBrand(Brand, XCorrelationID);
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

        // DELETE api/Brand/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteBrand(string id)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.DeleteBrandById(id, XCorrelationID);
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
