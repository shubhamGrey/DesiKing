using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<BrandController> _logger;

        public BrandController(IConfigService configService, ILogger<BrandController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/Brand
        [HttpGet]
        public ActionResult<IEnumerable<BrandResponseModel>> GetBrands()
        {
            _logger.LogInformation("GetBrands endpoint called");

            var correlationId = GetCorrelationId();
            var itemList = _configService.GetBrands(correlationId);
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
