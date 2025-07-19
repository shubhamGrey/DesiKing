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
            try
            {
                _logger.LogInformation("GetBrandById endpoint called with ID: {BrandId}", id);

                if (string.IsNullOrWhiteSpace(id))
                {
                    _logger.LogWarning("GetBrandById called with null or empty ID");
                    return CreateBadRequestResponse("Brand ID is required", GetCorrelationId());
                }

                var correlationId = GetCorrelationId();
                var item = _configService.GetBrandById(id, correlationId);

                if (item == null)
                {
                    _logger.LogWarning("Brand not found with ID: {BrandId}, correlation ID: {CorrelationId}", id, correlationId);
                    return CreateNotFoundResponse("Brand not found", correlationId);
                }

                _logger.LogInformation("Successfully retrieved brand with ID: {BrandId}, correlation ID: {CorrelationId}", id, correlationId);
                return Ok(item);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while retrieving brand with ID: {BrandId}, correlation ID: {CorrelationId}", id, correlationId);
                return HandleException(ex, "Failed to retrieve brand", correlationId);
            }
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
    }
}
