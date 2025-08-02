using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Http;
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
    }
}
