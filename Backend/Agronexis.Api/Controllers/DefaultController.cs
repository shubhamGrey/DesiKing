using Agronexis.Business.Configurations;
using Agronexis.Model;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class RootController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API is running");
        }
    }
}
