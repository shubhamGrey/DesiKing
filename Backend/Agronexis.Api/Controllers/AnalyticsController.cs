using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(IConfigService configService, ILogger<AnalyticsController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("track")]
        public async Task<IActionResult> TrackAnalytics([FromBody] AnalyticsPayloadRequest payload)
        {
            _logger.LogInformation("TrackAnalytics endpoint called");

            var correlationId = GetCorrelationId();
            _logger.LogInformation("Processing analytics tracking for correlation ID: {CorrelationId}", correlationId);

            try
            {
                if (payload?.Events == null || !payload.Events.Any())
                {
                    _logger.LogWarning("Invalid analytics payload - no events provided");
                    return BadRequest(new { message = "No analytics events provided" });
                }

                var result = await _configService.ProcessAnalyticsEvents(payload, correlationId);

                _logger.LogInformation("Successfully processed {Count} analytics events for correlation ID: {CorrelationId}", 
                    result.ProcessedEvents, correlationId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing analytics events for correlation ID: {CorrelationId}", correlationId);
                return StatusCode(500, new { message = "Internal server error while processing analytics events" });
            }
        }
    }
}