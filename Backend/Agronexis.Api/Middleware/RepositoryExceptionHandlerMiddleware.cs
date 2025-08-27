using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

public class RepositoryExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RepositoryExceptionHandlerMiddleware> _logger;

    public RepositoryExceptionHandlerMiddleware(RequestDelegate next, ILogger<RepositoryExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); // Continue pipeline
        }
        catch (RepositoryException rex)
        {
            _logger.LogError(rex, "RepositoryException caught. CorrelationId: {CorrelationId}", rex.CorrelationId);
            await HandleExceptionAsync(context, rex.Message, rex.StatusCode, rex.CorrelationId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception caught.");
            await HandleExceptionAsync(context, "An unexpected error occurred.", HttpStatusCode.InternalServerError, Guid.NewGuid().ToString());
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, string message, HttpStatusCode statusCode, string correlationId)
    {
        var response = new ApiResponseModel
        {
            Info = new ApiResponseInfoModel
            {
                IsSuccess = false,
                Code = ((int)statusCode).ToString(),
                Message = message
            },
            Id = correlationId
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
