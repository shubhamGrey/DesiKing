using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred during request processing");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = new ApiResponseModel
            {
                Info = new ApiResponseInfoModel()
            };

            switch (exception)
            {
                case ArgumentNullException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Info.Code = ((int)ServerStatusCodes.BadRequest).ToString();
                    response.Info.Message = "Invalid input parameters";
                    break;

                case ArgumentException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Info.Code = ((int)ServerStatusCodes.BadRequest).ToString();
                    response.Info.Message = "Invalid argument provided";
                    break;

                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response.Info.Code = ((int)ServerStatusCodes.Unauthorized).ToString();
                    response.Info.Message = "Unauthorized access";
                    break;

                case KeyNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Info.Code = ((int)ServerStatusCodes.NotFound).ToString();
                    response.Info.Message = "Resource not found";
                    break;

                case InvalidOperationException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Info.Code = ((int)ServerStatusCodes.BadRequest).ToString();
                    response.Info.Message = "Invalid operation requested";
                    break;

                case TimeoutException:
                    context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    response.Info.Code = ((int)ServerStatusCodes.RequestTimeout).ToString();
                    response.Info.Message = "Request timeout";
                    break;

                case NotImplementedException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotImplemented;
                    response.Info.Code = ((int)ServerStatusCodes.NotImplemented).ToString();
                    response.Info.Message = "Feature not implemented";
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response.Info.Code = ((int)ServerStatusCodes.InternalServerError).ToString();
                    response.Info.Message = "An internal server error occurred";
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }
    }

    public static class GlobalExceptionHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GlobalExceptionHandlerMiddleware>();
        }
    }
}
