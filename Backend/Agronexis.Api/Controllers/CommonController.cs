using Agronexis.Business.Configurations;
using Agronexis.ExternalApi;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<CommonController> _logger;
        private readonly ExternalUtility _externalUtility;

        public CommonController(
            IConfigService configService,
            ILogger<CommonController> logger,
            ExternalUtility externalUtility)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _externalUtility = externalUtility ?? throw new ArgumentNullException(nameof(externalUtility));
        }

        [HttpGet("GetCurrencies")]
        public ActionResult<IEnumerable<CurrencyResponseModel>> GetCurrencies()
        {
            var correlationId = GetCorrelationId();
            var itemList = _configService.GetCurrencies(correlationId);
            return itemList;
        }

        [HttpGet("GetWeights")]
        public ActionResult<IEnumerable<WeightResponseModel>> GetWeights()
        {
            var correlationId = GetCorrelationId();
            var itemList = _configService.GetWeights(correlationId);
            return itemList;
        }

        [HttpGet("GetStates/{countryCode}")]
        public async Task<ActionResult<IEnumerable<StateResponseModel>>> GetStatesAsync(string countryCode)
        {
            var correlationId = GetCorrelationId();
            var itemList = await _configService.GetStates(countryCode, correlationId);
            return itemList;
        }

        [HttpGet("GetCountries")]
        public async Task<ActionResult<IEnumerable<CountryResponseModel>>> GetCountriesAsync()
        {
            var correlationId = GetCorrelationId();
            var itemList = await _configService.GetCountries(correlationId);
            return itemList;
        }

        [HttpPost("contact")]
        public async Task<IActionResult> SendContactEmail([FromBody] ContactRequestModel request)
        {
            string xCorrelationId = GetCorrelationId();
            _logger.LogInformation("Contact form submission from {Email}, CorrelationId: {CorrelationId}",
                request.Email, xCorrelationId);
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(CreateErrorResponse("Invalid request"));

                string body = $"Name: {request.Name}\nEmail: {request.Email}\nPhone: {request.PhoneNumber ?? "N/A"}\n\nMessage:\n{request.Message}";
                await _externalUtility.SendEmailAsync(
                    "care@agronexis.com",
                    $"Website Contact Form — {request.Name}",
                    body,
                    false);

                return Ok(CreateSuccessResponse("Message sent successfully"));
            }
            catch (Exception ex)
            {
                return HandleException(ex, "Failed to send contact form email", xCorrelationId);
            }
        }
    }
}
