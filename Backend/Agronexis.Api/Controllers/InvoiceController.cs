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

        /// <summary>
        /// Generate Invoice PDF - Supports both complete invoice data and OrderId/UserId approach
        /// </summary>
        /// <param name="request">Invoice generation request - either complete data or OrderId/UserId</param>
        /// <returns>PDF file for download</returns>
        [HttpPost("generate")]
        public async Task<ActionResult> GenerateInvoice([FromBody] InvoicePdfGenerationRequest request)
        {
            var correlationId = string.Empty;

            try
            {
                correlationId = GetCorrelationId();
                _logger.LogInformation("Starting invoice PDF generation, CorrelationId: {CorrelationId}", correlationId);

                // Validate request
                if (request == null)
                {
                    return BadRequest(new { message = "Request cannot be null" });
                }

                GenerateInvoiceRequestModel invoiceData;

                // Check if we have OrderId and UserId (fetch from database) or complete invoice data
                if (request.OrderId.HasValue && request.UserId.HasValue)
                {
                    // Scenario 1: Generate PDF using OrderId and UserId
                    _logger.LogInformation("Generating PDF for OrderId: {OrderId}, UserId: {UserId}", request.OrderId, request.UserId);
                    
                    if (request.OrderId <= 0 || request.UserId <= 0)
                    {
                        return BadRequest(new { message = "OrderId and UserId must be greater than 0" });
                    }

                    // Get invoice data from database
                    invoiceData = await _configService.GetInvoiceDataByOrder(request.OrderId.Value, request.UserId.Value, correlationId);
                    
                    if (invoiceData == null)
                    {
                        _logger.LogWarning("No invoice data found for OrderId: {OrderId}, UserId: {UserId}", request.OrderId, request.UserId);
                        return NotFound(new { message = "Invoice not found for the specified order" });
                    }
                }
                else if (request.InvoiceData != null)
                {
                    // Scenario 2: Generate PDF using complete invoice data
                    _logger.LogInformation("Generating PDF using provided invoice data");
                    invoiceData = new GenerateInvoiceRequestModel
                    {
                        OrderId = request.InvoiceData.Invoice?.OrderNumber ?? "Unknown",
                        InvoiceData = request.InvoiceData
                    };
                }
                else
                {
                    return BadRequest(new { message = "Either provide OrderId/UserId or complete InvoiceData" });
                }

                // Generate the PDF
                var pdfBytes = await _configService.GenerateInvoicePdf(invoiceData, correlationId);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    _logger.LogError("PDF generation returned empty result");
                    return StatusCode(500, new { message = "Failed to generate PDF. Please try again." });
                }

                // Create safe filename for download
                var safeInvoiceNumber = invoiceData.InvoiceData.Invoice.Number.Replace("/", "_").Replace("\\", "_");
                var fileName = $"GST_Invoice_{safeInvoiceNumber}_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                _logger.LogInformation("Invoice PDF generated successfully, Size: {Size} bytes, FileName: {FileName}", 
                    pdfBytes.Length, fileName);

                // Return PDF file directly for download
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating invoice PDF, CorrelationId: {CorrelationId}", correlationId);
                
                return StatusCode(500, new { 
                    message = "An error occurred while generating the invoice PDF. Please try again later.",
                    correlationId = correlationId 
                });
            }
        }
    }
}
