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

        [HttpPost("generate-token")]
        public async Task<ActionResult<ApiResponseModel>> GenerateDtdcToken([FromBody] DtdcTokenRequestModel request)
        {
            var correlationId = GetCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel(),
                Id = correlationId
            };

            try
            {
                if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                {
                    response.Info.Code = "400";
                    response.Info.Message = "Invalid request. Username and password are required.";
                    return BadRequest(response);
                }

                var tokenResult = await _configService.GenerateDtdcToken(request, correlationId);

                if (tokenResult == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = tokenResult;
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while generating DTDC token. Correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to generate DTDC token", correlationId);
            }
        }

        [HttpPost("validate-pincode")]
        public async Task<ActionResult<ApiResponseModel>> ValidatePincode([FromBody] ValidatePincodeRequest request)
        {
            var correlationId = GetCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel(),
                Id = correlationId
            };

            try
            {
                if (request == null || string.IsNullOrEmpty(request.ToPincode))
                {
                    response.Info.Code = "400";
                    response.Info.Message = "Invalid request.";
                    return BadRequest(response);
                }

                // Call service method
                var result = await _configService.ValidatePincode(request, correlationId);

                if (result.ZipcodeResponses[0].Message.ToLower() != "success")
                {
                    response.Info.Code = "400";
                    response.Info.Message = "Pincode not serviceable.";
                    response.Data = result;
                    return BadRequest(response);
                }

                response.Info.Code = "200";
                response.Info.Message = "Pincode is serviceable.";
                response.Data = result;

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Pincode validation failed. Correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to validate pincode", correlationId);
            }
        }

        [HttpGet("dtdc/label/{awbNo}")]
        public async Task<ActionResult<ApiResponseModel>> PrintDtdcShipmentLabel(string awbNo, [FromQuery] string labelCode = "SHIP_LABEL_4X6", [FromQuery] string labelFormat = "pdf")
        {
            var correlationId = GetCorrelationId();

            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel(),
                Id = correlationId
            };

            try
            {
                if (string.IsNullOrWhiteSpace(awbNo))
                {
                    response.Info.Code = "400";
                    response.Info.Message = "AWB number is required.";
                    return BadRequest(response);
                }

                var request = new DTDC_ShipmentLabelRequestModel
                {
                    AwbNo = awbNo,
                    LabelCode = labelCode,
                    LabelFormat = labelFormat
                };

                var result = await _configService.PrintDtdcShipmentLabel(request, correlationId);

                if (result == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                    return NotFound(response);
                }

                response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                response.Info.Message = ApiResponseMessage.SUCCESS;
                response.Data = result;

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "DTDC label printing failed for AWB {AwbNo}, CorrelationId {CorrelationId}",
                    awbNo,
                    correlationId);

                return HandleException(ex, "Failed to print DTDC shipment label", correlationId);
            }
        }

        [HttpPost("dtdc/cancel-consignment")]
        public async Task<IActionResult> CancelConsignment( [FromBody] DTDC_CancelConsignmentRequestModel request, [FromHeader(Name = "x-correlation-id")] string xCorrelationId)
        {
            if (request == null || request.AWBNo == null || !request.AWBNo.Any())
                return BadRequest("AWB numbers are required.");

            var result = await _configService.CancelConsignment(request, xCorrelationId);
            return Ok(result);
        }

    }
}
