using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Agronexis.Common;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<ConfigurationController> _logger;

        public ConfigurationController(IConfigService configService, ILogger<ConfigurationController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Generate Invoice PDF and send for download
        /// </summary>
        /// <param name="request">Invoice generation request with OrderId and UserId</param>
        /// <returns>PDF file for download</returns>
        [HttpPost("GenerateInvoicePdf")]
        public async Task<ActionResult> GenerateInvoicePdf([FromBody] GenerateInvoicePdfRequestModel request)
        {
            var correlationId = string.Empty;

            try
            {
                correlationId = GetCorrelationId();
                _logger.LogInformation("Starting invoice PDF generation for OrderId: {OrderId}, UserId: {UserId}, CorrelationId: {CorrelationId}", 
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

                // Get invoice data from the database using OrderId and UserId
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

                // Create a safe filename
                var safeInvoiceNumber = invoiceData.InvoiceData.Invoice.Number.Replace("/", "_").Replace("\\", "_");
                var fileName = $"GST_Invoice_{safeInvoiceNumber}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                _logger.LogInformation("Invoice PDF generated successfully for OrderId: {OrderId}, Size: {Size} bytes, FileName: {FileName}", 
                    request.OrderId, pdfBytes.Length, fileName);

                // Return PDF for download
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

        /// <summary>
        /// Generate Invoice PDF from complete invoice data
        /// </summary>
        /// <param name="request">Complete invoice data for PDF generation</param>
        /// <returns>PDF file for download</returns>
        [HttpPost("GenerateInvoicePdfFromData")]
        public async Task<ActionResult> GenerateInvoicePdfFromData([FromBody] GenerateInvoiceRequestModel request)
        {
            var correlationId = string.Empty;

            try
            {
                correlationId = GetCorrelationId();
                _logger.LogInformation("Starting invoice PDF generation from data, CorrelationId: {CorrelationId}", correlationId);

                // Validate request
                if (request?.InvoiceData == null)
                {
                    return BadRequest(new { message = "Invoice data is required" });
                }

                // Generate the PDF
                var pdfBytes = await _configService.GenerateInvoicePdf(request, correlationId);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    _logger.LogError("PDF generation returned empty result");
                    return StatusCode(500, new { message = "Failed to generate PDF. Please try again." });
                }

                // Create a safe filename
                var safeInvoiceNumber = request.InvoiceData.Invoice.Number.Replace("/", "_").Replace("\\", "_");
                var fileName = $"GST_Invoice_{safeInvoiceNumber}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                _logger.LogInformation("Invoice PDF generated successfully, Size: {Size} bytes, FileName: {FileName}", 
                    pdfBytes.Length, fileName);

                // Return PDF for download
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating invoice PDF from data, CorrelationId: {CorrelationId}", correlationId);
                
                return StatusCode(500, new { 
                    message = "An error occurred while generating the invoice PDF. Please try again later.",
                    correlationId = correlationId 
                });
            }
        }

        /// <summary>
        /// Health check endpoint for Configuration service
        /// </summary>
        /// <returns>Service status</returns>
        [HttpGet("Health")]
        public ActionResult GetHealth()
        {
            return Ok(new { 
                status = "healthy", 
                timestamp = DateTime.UtcNow,
                service = "Configuration API"
            });
        }
    }
}