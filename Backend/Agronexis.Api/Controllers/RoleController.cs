using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Agronexis.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IConfigService _configService;
        string XCorrelationID = string.Empty;

        public RoleController(IConfigService configService)
        {
            _configService = configService;
        }

        // GET api/Role
        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<RoleResponseModel>> GetRoles()
        {
            SetXCorrelationId();
            var itemList = _configService.GetRoles(XCorrelationID);
            return itemList;
        }

        // GET api/Role/{id}
        [HttpGet("{id}")]
        public ActionResult<RoleResponseModel> GetRoleById(string id)
        {
            SetXCorrelationId();
            var item = _configService.GetRoleById(id, XCorrelationID);
            return item;
        }

        // POST api/Role
        [HttpPost]
        public ActionResult<ApiResponseModel> SaveOrUpdateRole([FromBody] RoleRequestModel role)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.SaveOrUpdateRole(role, XCorrelationID);
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

        // DELETE api/Role/{id}
        [HttpDelete("{id}")]
        public ActionResult<ApiResponseModel> DeleteRole(string id)
        {
            SetXCorrelationId();
            ApiResponseModel response = new()
            {
                Info = new ApiResponseInfoModel()
            };

            var item = _configService.DeleteRoleById(id, XCorrelationID);
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
