using Agronexis.Business.Configurations;
using Agronexis.Model;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(IConfigService configService, ILogger<CheckoutController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        // POST api/Checkout
        [HttpPost]
        public ActionResult<ApiResponseModel> CreateOrder([FromBody] OrderRequestModel order)
        {
            try
            {
                _logger.LogInformation("CreateOrder endpoint called");

                if (order == null)
                {
                    _logger.LogWarning("CreateOrder called with null order data");
                    return CreateBadRequestResponse("Order data is required", GetCorrelationId());
                }

                var correlationId = GetCorrelationId();
                var item = _configService.CreateOrder(order, correlationId);

                if (item == null)
                {
                    _logger.LogWarning("Failed to create order, correlation ID: {CorrelationId}", correlationId);
                    return CreateNotFoundResponse("Failed to create order", correlationId);
                }

                _logger.LogInformation("Successfully created order with correlation ID: {CorrelationId}", correlationId);
                return CreateSuccessResponse(item, "Order created successfully", correlationId);
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while creating order with correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to create order", correlationId);
            }
        }
    }
}
