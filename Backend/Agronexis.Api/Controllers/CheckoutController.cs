using Agronexis.Business.Configurations;
using Agronexis.Model;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Agronexis.ExternalApi;
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
        private readonly ExternalUtility _externalUtility;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(IConfigService configService, ExternalUtility externalUtility, ILogger<CheckoutController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _externalUtility = externalUtility ?? throw new ArgumentNullException(nameof(externalUtility));
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

                // Handle Razorpay payment method
                if (order.PaymentMethod?.ToUpper() == "RAZORPAY")
                {
                    _logger.LogInformation("Creating Razorpay order for amount: {Amount}, correlation ID: {CorrelationId}",
                        order.TotalAmount, correlationId);

                    string razorpayOrderId = _externalUtility.CreateOrder(order.TotalAmount);

                    if (string.IsNullOrEmpty(razorpayOrderId))
                    {
                        _logger.LogWarning("Failed to create Razorpay order, correlation ID: {CorrelationId}", correlationId);
                        return CreateNotFoundResponse("Failed to create Razorpay order", correlationId);
                    }

                    _logger.LogInformation("Successfully created Razorpay order: {OrderId}, correlation ID: {CorrelationId}",
                        razorpayOrderId, correlationId);

                    // Create the order in the system and return Razorpay details
                    var item = _configService.CreateOrder(order, correlationId);

                    if (item == null)
                    {
                        _logger.LogWarning("Failed to create order in system, correlation ID: {CorrelationId}", correlationId);
                        return CreateNotFoundResponse("Failed to create order", correlationId);
                    }

                    return Ok(new
                    {
                        success = true,
                        data = item,
                        razorpayOrderId = razorpayOrderId,
                        amount = order.TotalAmount,
                        currency = order.Currency ?? "INR",
                        message = "Order created successfully with Razorpay"
                    });
                }
                else
                {
                    // Handle COD or other payment methods
                    var item = _configService.CreateOrder(order, correlationId);

                    if (item == null)
                    {
                        _logger.LogWarning("Failed to create order, correlation ID: {CorrelationId}", correlationId);
                        return CreateNotFoundResponse("Failed to create order", correlationId);
                    }

                    _logger.LogInformation("Successfully created order with correlation ID: {CorrelationId}", correlationId);
                    return CreateSuccessResponseAction(item, "Order created successfully", correlationId);
                }
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred while creating order with correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to create order", correlationId);
            }
        }

        // POST api/Checkout/verify-payment
        [HttpPost("verify-payment")]
        public ActionResult VerifyPayment([FromBody] PaymentVerificationRequest request)
        {
            try
            {
                _logger.LogInformation("Payment verification endpoint called");

                if (request == null)
                {
                    _logger.LogWarning("Payment verification called with null request data");
                    return CreateBadRequestResponse("Payment verification data is required", GetCorrelationId());
                }

                var correlationId = GetCorrelationId();
                _logger.LogInformation("Verifying payment for order: {OrderId}, correlation ID: {CorrelationId}",
                    request.RazorpayOrderId, correlationId);

                bool isValid = _externalUtility.VerifyPayment(
                    request.RazorpayOrderId,
                    request.RazorpayPaymentId,
                    request.RazorpaySignature
                );

                if (isValid)
                {
                    _logger.LogInformation("Payment verification successful for order: {OrderId}, correlation ID: {CorrelationId}",
                        request.RazorpayOrderId, correlationId);

                    return Ok(new { success = true, message = "Payment verified successfully" });
                }
                else
                {
                    _logger.LogWarning("Payment verification failed for order: {OrderId}, correlation ID: {CorrelationId}",
                        request.RazorpayOrderId, correlationId);

                    return CreateBadRequestResponse("Payment verification failed", correlationId);
                }
            }
            catch (Exception ex)
            {
                var correlationId = GetCorrelationId();
                _logger.LogError(ex, "Error occurred during payment verification, correlation ID: {CorrelationId}", correlationId);
                return HandleException(ex, "Failed to verify payment", correlationId);
            }
        }
    }

    public class PaymentVerificationRequest
    {
        public string RazorpayOrderId { get; set; } = string.Empty;
        public string RazorpayPaymentId { get; set; } = string.Empty;
        public string RazorpaySignature { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
    }
}
