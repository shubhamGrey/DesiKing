using Agronexis.Business.Configurations;
using Agronexis.Model;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipmentController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<ShipmentController> _logger;

        public ShipmentController(IConfigService configService, ILogger<ShipmentController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet("track/{awbNo}")]
        public async Task<ActionResult<ApiResponseModel>> TrackShipment(string awbNo)
        {
            var correlationId = GetCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel(),
                Id = correlationId
            };

            try
            {
                var trackingData = await _configService.TrackShipment(awbNo, correlationId);

                if (trackingData == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = trackingData;
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while tracking shipment {AWBNo}, Correlation ID: {CorrelationId}", awbNo, correlationId);
                return HandleException(ex, "Failed to track shipment", correlationId);
            }
        }

        [HttpGet("label/{awbNo}")]
        public async Task<ActionResult<ApiResponseModel>> GenerateShipmentLabel(string awbNo)
        {
            var correlationId = GetCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel(),
                Id = correlationId
            };

            try
            {
                var labelResult = await _configService.GenerateShipmentLabel(awbNo, correlationId);

                if (labelResult == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = labelResult;
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while generating shipment label {AWBNo}, Correlation ID: {CorrelationId}", awbNo, correlationId);
                return HandleException(ex, "Failed to generate shipment label", correlationId);
            }
        }

        [HttpPost("pickup-booking")]
        public async Task<ActionResult<ApiResponseModel>> CreatePickupBooking([FromBody] PickupBookingRequestModel request)
        {
            var correlationId = GetCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel(),
                Id = correlationId
            };

            try
            {
                // optional: basic server-side validation and normalize request
                if (request == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.BadRequest).ToString();
                    response.Info.Message = "Request body is required.";
                    return BadRequest(response);
                }

                var result = await _configService.CreatePickupBooking(request, correlationId);

                if (result == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = result;
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating pickup booking. Correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to create pickup booking", correlationId);
            }
        }


    }
}
 