using System;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected string XCorrelationID { get; set; } = string.Empty;

        protected string GetCorrelationId()
        {
            return Request.Headers.TryGetValue("X-Correlation-ID", out var correlationId)
                ? correlationId.ToString()
                : Guid.NewGuid().ToString();
        }

        protected void SetXCorrelationId()
        {
            if (Request != null)
            {
                XCorrelationID = (!string.IsNullOrEmpty(Convert.ToString(Request.Headers["X-Correlation-ID"])))
                    ? Convert.ToString(Request.Headers["X-Correlation-ID"])
                    : Convert.ToString(Guid.NewGuid());
            }
            else
            {
                XCorrelationID = Convert.ToString(Guid.NewGuid());
            }
        }

        protected ApiResponseModel CreateSuccessResponse(object data = null, string message = null)
        {
            return new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = ((int)ServerStatusCodes.Ok).ToString(),
                    Message = message ?? ApiResponseMessage.SUCCESS
                },
                Data = data
            };
        }

        protected ActionResult CreateSuccessResponseAction(object data, string message, string correlationId)
        {
            var response = new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = ((int)ServerStatusCodes.Ok).ToString(),
                    Message = message ?? ApiResponseMessage.SUCCESS
                },
                Data = data
            };
            return Ok(response);
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

        protected ActionResult CreateBadRequestResponse(string message, string correlationId = null)
        {
            var response = new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = ((int)ServerStatusCodes.BadRequest).ToString(),
                    Message = message
                }
            };
            return BadRequest(response);
        }

        protected ActionResult CreateNotFoundResponse(string message, string correlationId = null)
        {
            var response = new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = ((int)ServerStatusCodes.NotFound).ToString(),
                    Message = message
                }
            };
            return NotFound(response);
        }

        protected ActionResult HandleException(Exception ex, string message, string correlationId = null)
        {
            // Log the exception here if needed
            var response = new ApiResponseModel
            {
                Info = new ApiResponseInfoModel
                {
                    Code = ((int)ServerStatusCodes.InternalServerError).ToString(),
                    Message = message ?? "An error occurred while processing your request"
                }
            };
            return StatusCode(500, response);
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
