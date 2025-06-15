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
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IConfigService _configService;
        string XCorrelationID = string.Empty;
        private readonly IMemoryCache memoryCache;

        public CategoryController(IConfigService configService, IMemoryCache memoryCache)
        {
            _configService = configService;
            this.memoryCache = memoryCache;
        }

        // GET api/Category
        [HttpGet]
        public ActionResult<IEnumerable<CategoryResponseModel>> GetCategories()
        {
            SetXCorrelationId();
            var itemList = _configService.GetCategories(XCorrelationID);
            return itemList;
        }

        // GET api/Category/{id}
        [HttpGet("{id}")]
        public ActionResult<CategoryResponseModel> GetCategoryById(string id)
        {
            SetXCorrelationId();
            var item = _configService.GetCategoryById(id, XCorrelationID);
            return item;
        }

        // POST api/Category
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateCategory([FromBody] CategoryRequestModel Category)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.SaveOrUpdateCategory(Category, XCorrelationID);
            if (item == null)
            {
                response.Info.Code = ((int)ServerStatusCodes.NotFound).ToString();
                response.Info.Message = ApiResponseMessage.DATANOTFOUND;
            }
            else
            {
                response.Info.Code = ((int)ServerStatusCodes.Ok).ToString();
                response.Info.Message = ApiResponseMessage.SUCCESS;
                response.Data = item;
            }
            return response;
        }

        // DELETE api/Category/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteCategory(string id)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.DeleteCategoryById(id, XCorrelationID);
            if (item == null)
            {
                response.Info.Code = ((int)ServerStatusCodes.NotFound).ToString();
                response.Info.Message = ApiResponseMessage.DATANOTFOUND;
            }
            else
            {
                response.Info.Code = ((int)ServerStatusCodes.Ok).ToString();
                response.Info.Message = ApiResponseMessage.SUCCESS;
                response.Data = item;
            }
            return response;
        }

        private void SetXCorrelationId()
        {
            if (Request != null)
            {
                XCorrelationID = (!string.IsNullOrEmpty(Convert.ToString(Request.Headers["X-Correlation-ID"]))) ? Convert.ToString(Request.Headers["X-Correlation-ID"]) : Convert.ToString(Guid.NewGuid());
            }
            else
            {
                XCorrelationID = Convert.ToString(Guid.NewGuid());
            }
        }
    }
}
