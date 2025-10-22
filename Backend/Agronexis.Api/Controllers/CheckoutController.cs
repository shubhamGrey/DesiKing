using Agronexis.Business.Configurations;
using Agronexis.ExternalApi;
using Agronexis.Model;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using System.Net;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ExternalUtility _externalUtility;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(IConfigService configService, ExternalUtility externalUtility, ILogger<CheckoutController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _externalUtility = externalUtility ?? throw new ArgumentNullException(nameof(externalUtility));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("create-order")]
        public async Task<ActionResult<ApiResponseModel>> CreateOrder([FromBody] OrderRequestModel order)
        {
            var correlationId = string.Empty;
            try
            {
                correlationId = GetCorrelationId();
                ApiResponseModel response = new()
                {
                    Info = new ApiResponseInfoModel()
                };

                var item = await _configService.CreateOrder(order, correlationId);
                if (item == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = item;
                }
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating order with correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to create order", correlationId);
            }
        }

        [HttpPost("verify-payment")]
        public async Task<ActionResult<ApiResponseModel>> VerifyPayment([FromBody] VerifyPaymentRequestModel verify)
        {
            var correlationId = string.Empty;

            try
            {
                correlationId = GetCorrelationId();
                ApiResponseModel response = new()
                {
                    Info = new ApiResponseInfoModel()
                };

                var item = await _configService.VerifyPayment(verify, XCorrelationID);
                if (item == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = item;
                }
                return response;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during payment verification, correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to verify payment", correlationId);
            }
        }

        [HttpPost("refund-payment")]
        public async Task<ActionResult<ApiResponseModel>> RefundPayment([FromBody] RefundPaymentRequestModel refund)
        {
            var correlationId = string.Empty;
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            try
            {
                correlationId = GetCorrelationId();

                var item = _configService.RefundPayment(refund, XCorrelationID);
                if (item == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = item;
                }
                return response;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during payment verification, correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to refund payment", correlationId);
            }
        }

        [HttpGet("user/{userId}")]
        public ActionResult<ApiResponseModel> GetOrdersByUserId(string userId)
        {
            var correlationId = string.Empty;
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            try
            {
                correlationId = GetCorrelationId();

                var orders = _configService.GetOrdersByUserId(userId, XCorrelationID);
                if (orders == null || !orders.Any())
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = orders;
                }
                response.Id = correlationId;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching orders for user {UserId}, correlation ID: {CorrelationId}", userId, correlationId);
                return HandleException(ex, "Failed to fetch orders", correlationId);
            }
        }

        [HttpGet("order/{orderId}")]
        public ActionResult<ApiResponseModel> GetOrderId(string orderId)
        {
            var correlationId = string.Empty;
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            try
            {
                correlationId = GetCorrelationId();

                var orders = _configService.GetOrderId(orderId, XCorrelationID);
                if (orders == null)
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = orders;
                }
                response.Id = correlationId;
                return response;
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Failed to fetch orders", correlationId);
            }
        }

        [HttpGet("all-orders")]
        public ActionResult<ApiResponseModel> GetAllOrders()
        {
            var correlationId = string.Empty;
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            try
            {
                correlationId = GetCorrelationId();

                var orders = _configService.GetAllOrders(XCorrelationID);
                if (orders == null || !orders.Any())
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = ApiResponseMessage.DATANOTFOUND;
                }
                else
                {
                    response.Info.Code = ((int)Common.Constants.ServerStatusCodes.Ok).ToString();
                    response.Info.Message = ApiResponseMessage.SUCCESS;
                    response.Data = orders;
                }
                response.Id = correlationId;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all orders, correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to fetch all orders", correlationId);
            }
        }
    }
}
