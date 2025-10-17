using Agronexis.Api.Controllers;
using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Agronexis.Common;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InvoiceController : BaseController
    {
        private readonly IInvoiceService _invoiceService;
        private readonly ILogger<InvoiceController> _logger;

        public InvoiceController(IInvoiceService invoiceService, ILogger<InvoiceController> logger)
        {
            _invoiceService = invoiceService;
            _logger = logger;
        }

        /// <summary>
        /// Generate GST-compliant invoice PDF for an order
        /// </summary>
        /// <param name="request">Invoice generation request containing order details and customer information</param>
        /// <returns>PDF file as byte array</returns>
        [HttpPost("generate")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseModel), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseModel), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GenerateInvoice([FromBody] GenerateInvoiceRequestModel request)
        {
            try
            {
                SetXCorrelationId();
                _logger.LogInformation($"[{XCorrelationID}] Starting invoice generation for order: {request.OrderId}");

                // Validate request
                if (request == null || string.IsNullOrEmpty(request.OrderId) || request.InvoiceData == null)
                {
                    _logger.LogWarning($"[{XCorrelationID}] Invalid request: Missing order ID or invoice data");
                    return BadRequest(new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            IsSuccess = false,
                            Message = "Invalid request. Order ID and invoice data are required.",
                            Code = Constants.ApiResponseMessage.INVALIDREQUEST
                        }
                    });
                }

                // Validate invoice data completeness
                var validationErrors = ValidateInvoiceData(request.InvoiceData);
                if (validationErrors.Any())
                {
                    _logger.LogWarning($"[{XCorrelationID}] Validation errors: {string.Join(", ", validationErrors)}");
                    return BadRequest(new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            IsSuccess = false,
                            Message = $"Validation failed: {string.Join(", ", validationErrors)}",
                            Code = Constants.ApiResponseMessage.VALIDATION_FAILED
                        }
                    });
                }

                // Generate PDF
                _logger.LogInformation($"[{XCorrelationID}] Generating PDF for invoice: {request.InvoiceData.Invoice.Number}");
                var pdfBytes = await _invoiceService.GenerateGstInvoicePdfAsync(request.InvoiceData);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    _logger.LogError($"[{XCorrelationID}] PDF generation returned empty result");
                    return StatusCode(500, new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            IsSuccess = false,
                            Message = "Failed to generate PDF. Please try again.",
                            Code = Constants.ApiResponseMessage.INTERNALSERVERERROR
                        }
                    });
                }

                _logger.LogInformation($"[{XCorrelationID}] Successfully generated PDF ({pdfBytes.Length} bytes) for order: {request.OrderId}");

                // Generate filename with safe characters
                var safeInvoiceNumber = request.InvoiceData.Invoice.Number.Replace("/", "_").Replace("\\", "_");
                var fileName = $"GST_Invoice_{safeInvoiceNumber}.pdf";

                // Return PDF file
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[{XCorrelationID}] Error generating invoice for order: {request?.OrderId}");
                return StatusCode(500, new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        IsSuccess = false,
                        Message = "An error occurred while generating the invoice. Please try again later.",
                        Code = Constants.ApiResponseMessage.INTERNALSERVERERROR
                    }
                });
            }
        }

        /// <summary>
        /// Validate invoice data for GST compliance
        /// </summary>
        /// <param name="invoiceData">Invoice data to validate</param>
        /// <returns>List of validation errors</returns>
        private List<string> ValidateInvoiceData(InvoiceDataModel invoiceData)
        {
            var errors = new List<string>();

            // Supplier validation
            if (string.IsNullOrEmpty(invoiceData.Supplier?.Name))
                errors.Add("Supplier name is required");
            if (string.IsNullOrEmpty(invoiceData.Supplier?.Gstin))
                errors.Add("Supplier GSTIN is required");
            if (string.IsNullOrEmpty(invoiceData.Supplier?.Address))
                errors.Add("Supplier address is required");

            // Invoice details validation
            if (string.IsNullOrEmpty(invoiceData.Invoice?.Number))
                errors.Add("Invoice number is required");
            if (string.IsNullOrEmpty(invoiceData.Invoice?.Date))
                errors.Add("Invoice date is required");

            // Customer validation
            if (string.IsNullOrEmpty(invoiceData.Customer?.Name))
                errors.Add("Customer name is required");
            if (string.IsNullOrEmpty(invoiceData.Customer?.Address))
                errors.Add("Customer address is required");
            if (string.IsNullOrEmpty(invoiceData.Customer?.StateCode))
                errors.Add("Customer state code is required for GST compliance");

            // Items validation
            if (invoiceData.Items == null || !invoiceData.Items.Any())
                errors.Add("At least one invoice item is required");
            else
            {
                for (int i = 0; i < invoiceData.Items.Count; i++)
                {
                    var item = invoiceData.Items[i];
                    if (string.IsNullOrEmpty(item.Description))
                        errors.Add($"Item {i + 1}: Description is required");
                    if (string.IsNullOrEmpty(item.HsnCode))
                        errors.Add($"Item {i + 1}: HSN code is required for GST compliance");
                    if (item.Quantity <= 0)
                        errors.Add($"Item {i + 1}: Quantity must be greater than 0");
                    if (item.Rate <= 0)
                        errors.Add($"Item {i + 1}: Rate must be greater than 0");
                }
            }

            // Tax summary validation
            if (invoiceData.TaxSummary == null)
                errors.Add("Tax summary is required");
            else
            {
                if (string.IsNullOrEmpty(invoiceData.TaxSummary.PlaceOfSupply))
                    errors.Add("Place of supply is required for GST compliance");
            }

            return errors;
        }

        /// <summary>
        /// Health check endpoint for invoice service
        /// </summary>
        /// <returns>Service status</returns>
        [HttpGet("health")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponseModel), StatusCodes.Status200OK)]
        public IActionResult HealthCheck()
        {
            try
            {
                SetXCorrelationId();
                return Ok(new ApiResponseModel
                {
                    Data = "Invoice service is healthy",
                    Info = new ApiResponseInfoModel
                    {
                        IsSuccess = true,
                        Message = "Service is running",
                        Code = Constants.ApiResponseMessage.SUCCESS
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[{XCorrelationID}] Health check failed");
                return StatusCode(500, new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        IsSuccess = false,
                        Message = "Service health check failed",
                        Code = Constants.ApiResponseMessage.INTERNALSERVERERROR
                    }
                });
            }
        }
    }
}