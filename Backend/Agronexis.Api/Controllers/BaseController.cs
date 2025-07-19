using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected string GetCorrelationId()
        {
            return Request.Headers.TryGetValue("X-Correlation-ID", out var correlationId)
                ? correlationId.ToString()
                : Guid.NewGuid().ToString();
        }

        protected ApiResponseModel CreateSuccessResponse(object data = null)
        {
            return new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = ((int)ServerStatusCodes.Ok).ToString(),
                    Message = ApiResponseMessage.SUCCESS
                },
                Data = data
            };
        }

        protected ApiResponseModel CreateErrorResponse(string message, ServerStatusCodes statusCode = ServerStatusCodes.BadRequest)
        {
            return new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = ((int)statusCode).ToString(),
                    Message = message
                }
            };
        }

        protected void ValidateModel()
        {
            if (!ModelState.IsValid)
            {
                throw new ArgumentException("Invalid model state");
            }
        }

        protected void ValidateNotNull(object obj, string paramName)
        {
            if (obj == null)
            {
                throw new ArgumentNullException(paramName, $"{paramName} cannot be null");
            }
        }

        protected void ValidateNotNullOrEmpty(string value, string paramName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException($"{paramName} cannot be null or empty", paramName);
            }
        }
    }
}
