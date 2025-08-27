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

        public BrandController(IConfigService configService)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
        }

        // GET api/Brand
        [HttpGet]
        public ActionResult<ApiResponseModel> GetBrands()
        {
            SetXCorrelationId();

            var itemList = _configService.GetBrands(XCorrelationID);

            return new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = itemList == null || !itemList.Any()
                        ? ((int)ServerStatusCodes.NotFound).ToString()
                        : ((int)ServerStatusCodes.Ok).ToString(),
                    Message = itemList == null || !itemList.Any()
                        ? ApiResponseMessage.DATANOTFOUND
                        : ApiResponseMessage.SUCCESS
                },
                Data = itemList
            };
        }

        // GET api/Brand/{id}
        [HttpGet("{id}")]
        public ActionResult<ApiResponseModel> GetBrandById(string id)
        {
            SetXCorrelationId();

            if (string.IsNullOrWhiteSpace(id))
            {
                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = ((int)ServerStatusCodes.BadRequest).ToString(),
                        Message = "Brand ID is required"
                    }
                };
            }

            var item = _configService.GetBrandById(id, XCorrelationID);

            return new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = item == null
                        ? ((int)ServerStatusCodes.NotFound).ToString()
                        : ((int)ServerStatusCodes.Ok).ToString(),
                    Message = item == null
                        ? ApiResponseMessage.DATANOTFOUND
                        : ApiResponseMessage.SUCCESS
                },
                Data = item
            };
        }

        // POST api/Brand
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateBrand([FromBody] BrandRequestModel brand)
        {
            SetXCorrelationId();

            var item = _configService.SaveOrUpdateBrand(brand, XCorrelationID);

            return new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = item == null
                        ? ((int)ServerStatusCodes.NotFound).ToString()
                        : ((int)ServerStatusCodes.Ok).ToString(),
                    Message = item == null
                        ? ApiResponseMessage.DATANOTFOUND
                        : ApiResponseMessage.SUCCESS
                },
                Data = item
            };
        }

        // DELETE api/Brand/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteBrand(string id)
        {
            SetXCorrelationId();

            var item = _configService.DeleteBrandById(id, XCorrelationID);

            return new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = item == null
                        ? ((int)ServerStatusCodes.NotFound).ToString()
                        : ((int)ServerStatusCodes.Ok).ToString(),
                    Message = item == null
                        ? ApiResponseMessage.DATANOTFOUND
                        : ApiResponseMessage.SUCCESS
                },
                Data = item
            };
        }
    }
}
