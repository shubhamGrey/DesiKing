using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Microsoft.AspNetCore.Mvc;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<InvoiceController> _logger;

        public InvoiceController(IConfigService configService, ILogger<InvoiceController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("generate")]
        public async Task<ActionResult> GenerateInvoice([FromBody] GenerateInvoiceRequestModel request)
        {
            var correlationId = string.Empty;

            try
            {
                correlationId = GetCorrelationId();
                _logger.LogInformation("Starting invoice PDF generation for Order: {OrderId}, CorrelationId: {CorrelationId}", 
                    request.OrderId, correlationId);

                // Validate request
                if (request?.InvoiceData == null)
                {
                    _logger.LogWarning("Invalid request: Invoice data is missing, CorrelationId: {CorrelationId}", correlationId);
                    return BadRequest(new { message = "Invoice data is required" });
                }

                // Call service to generate PDF
                var pdfBytes = await _configService.GenerateInvoicePdf(request, correlationId);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    _logger.LogError("PDF generation returned empty result for Order: {OrderId}, CorrelationId: {CorrelationId}", 
                        request.OrderId, correlationId);
                    return StatusCode(500, new { message = "Failed to generate PDF. Please try again." });
                }

                // Create safe filename for download
                var safeInvoiceNumber = request.InvoiceData.Invoice.Number.Replace("/", "_").Replace("\\", "_");
                var fileName = $"GST_Invoice_{safeInvoiceNumber}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                _logger.LogInformation("Invoice PDF generated successfully for Order: {OrderId}, Size: {Size} bytes, FileName: {FileName}, CorrelationId: {CorrelationId}", 
                    request.OrderId, pdfBytes.Length, fileName, correlationId);

                // Return PDF file directly for download
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating invoice PDF for Order: {OrderId}, CorrelationId: {CorrelationId}", 
                    request.OrderId, correlationId);
                
                return StatusCode(500, new { 
                    message = "An error occurred while generating the invoice PDF. Please try again later.",
                    correlationId = correlationId 
                });
            }
        }

        /// <summary>
        /// Generate Invoice PDF by OrderId and UserId
        /// </summary>
        /// <param name="request">Request containing OrderId and UserId</param>
        /// <returns>PDF file for download</returns>
        [HttpPost("generate-by-order")]
        public async Task<ActionResult> GenerateInvoiceByOrder([FromBody] GenerateInvoiceByOrderRequestModel request)
        {
            var correlationId = string.Empty;

            try
            {
                correlationId = GetCorrelationId();
                _logger.LogInformation("Starting invoice PDF generation by order for OrderId: {OrderId}, UserId: {UserId}, CorrelationId: {CorrelationId}", 
                    request.OrderId, request.UserId, correlationId);

                // Validate request
                if (request.OrderId <= 0)
                {
                    _logger.LogWarning("Invalid OrderId provided: {OrderId}", request.OrderId);
                    return BadRequest(new { message = "OrderId must be greater than 0" });
                }

                if (request.UserId <= 0)
                {
                    _logger.LogWarning("Invalid UserId provided: {UserId}", request.UserId);
                    return BadRequest(new { message = "UserId must be greater than 0" });
                }

                // Get invoice data from database using OrderId and UserId
                var invoiceData = await _configService.GetInvoiceDataByOrder(request.OrderId, request.UserId, correlationId);
                
                if (invoiceData == null)
                {
                    _logger.LogWarning("No invoice data found for OrderId: {OrderId}, UserId: {UserId}", request.OrderId, request.UserId);
                    return NotFound(new { message = "Invoice not found for the specified order" });
                }

                // Generate the PDF
                var pdfBytes = await _configService.GenerateInvoicePdf(invoiceData, correlationId);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    _logger.LogError("PDF generation returned empty result for OrderId: {OrderId}", request.OrderId);
                    return StatusCode(500, new { message = "Failed to generate PDF. Please try again." });
                }

                // Create safe filename for download
                var safeInvoiceNumber = invoiceData.InvoiceData.Invoice.Number.Replace("/", "_").Replace("\\", "_");
                var fileName = $"GST_Invoice_{safeInvoiceNumber}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                _logger.LogInformation("Invoice PDF generated successfully for OrderId: {OrderId}, Size: {Size} bytes, FileName: {FileName}", 
                    request.OrderId, pdfBytes.Length, fileName);

                // Return PDF file directly for download
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating invoice PDF for OrderId: {OrderId}, UserId: {UserId}, CorrelationId: {CorrelationId}", 
                    request.OrderId, request.UserId, correlationId);
                
                return StatusCode(500, new { 
                    message = "An error occurred while generating the invoice PDF. Please try again later.",
                    correlationId = correlationId 
                });
            }
        }
    }
}
