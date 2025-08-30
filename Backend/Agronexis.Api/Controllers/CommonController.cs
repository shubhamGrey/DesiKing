using Agronexis.Business.Configurations;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ILogger<BrandController> _logger;

        public CommonController(IConfigService configService, ILogger<BrandController> logger)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/Currencies
        [HttpGet("GetCurrencies")]
        public ActionResult<IEnumerable<CurrencyResponseModel>> GetCurrencies()
        {
            var correlationId = GetCorrelationId();
            var itemList = _configService.GetCurrencies(correlationId);
            return itemList;
        }

        // GET api/Weights
        [HttpGet("GetWeights")]
        public ActionResult<IEnumerable<WeightResponseModel>> GetWeights()
        {
            var correlationId = GetCorrelationId();
            var itemList = _configService.GetWeights(correlationId);
            return itemList;
        }

        // GET api/States
        [HttpGet("GetStates/{countryCode}")]
        public async Task<ActionResult<IEnumerable<StateResponseModel>>> GetStatesAsync(string countryCode)
        {
            var correlationId = GetCorrelationId();
            var itemList = await _configService.GetStates(countryCode, correlationId);
            return itemList;
        }

        // GET api/Countries
        [HttpGet("GetCountries")]
        public async Task<ActionResult<IEnumerable<CountryResponseModel>>> GetCountriesAsync()
        {
            var correlationId = GetCorrelationId();
            var itemList = await _configService.GetCountries(correlationId);
            return itemList;
        }
    }
}
