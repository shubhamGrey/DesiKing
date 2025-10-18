using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Agronexis.Common;

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
        public async Task<ActionResult<ApiResponseModel>> GenerateInvoice([FromBody] GenerateInvoiceRequestModel request)
        {
            var correlationId = string.Empty;
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            try
            {
                correlationId = GetCorrelationId();

                // Call service to generate PDF
                var pdfBytes = await _configService.GenerateInvoicePdf(request, correlationId);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    response.Info.Code = Constants.ApiResponseMessage.INTERNALSERVERERROR;
                    response.Info.IsSuccess = false;
                    response.Info.Message = "Failed to generate PDF. Please try again.";
                    return StatusCode(500, response);
                }

                var safeInvoiceNumber = request.InvoiceData.Invoice.Number.Replace("/", "_").Replace("\\", "_");
                var fileName = $"GST_Invoice_{safeInvoiceNumber}.pdf";

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating invoice, correlation ID: {CorrelationId}", correlationId);
                response.Info.Code = Constants.ApiResponseMessage.INTERNALSERVERERROR;
                response.Info.IsSuccess = false;
                response.Info.Message = "An error occurred while generating the invoice. Please try again later.";
                return StatusCode(500, response);
            }
        }
    }
}
