using Agronexis.Api.Controllers;
using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using static Agronexis.Common.Constants;

[Route("api/[controller]")]
[ApiController]
public class CartController : BaseController
{
    private readonly IConfigService _configService;
    private readonly ILogger<CartController> _logger;

    public CartController(IConfigService configService, ILogger<CartController> logger)
    {
        _configService = configService ?? throw new ArgumentNullException(nameof(configService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpGet("{userId}")]
    public ActionResult<ApiResponseModel> GetCartItemsByUserId(string userId)
    {
        SetXCorrelationId();
        var item = _configService.GetCartItemsByUserId(userId, XCorrelationID);

        return new ApiResponseModel
        {
            Info = new ApiResponseInfoModel
            {
                IsSuccess = true,
                Code = ((int)HttpStatusCode.OK).ToString(),
                Message = ApiResponseMessage.SUCCESS
            },
            Data = item,
            Id = XCorrelationID
        };
    }

    [HttpPost]
    public ActionResult<ApiResponseModel> SaveOrUpdateCart([FromBody] CartRequestModel cart)
    {
        SetXCorrelationId();
        var item = _configService.SaveOrUpdateCart(cart, XCorrelationID);

        return new ApiResponseModel
        {
            Info = new ApiResponseInfoModel
            {
                IsSuccess = true,
                Code = ((int)HttpStatusCode.OK).ToString(),
                Message = ApiResponseMessage.SUCCESS
            },
            Data = item,
            Id = XCorrelationID
        };
    }

    [HttpDelete("{id}")]
    public ActionResult<ApiResponseModel> DeleteCart(string id)
    {
        SetXCorrelationId();
        var item = _configService.DeleteCartById(id, XCorrelationID);

        return new ApiResponseModel
        {
            Info = new ApiResponseInfoModel
            {
                IsSuccess = true,
                Code = ((int)HttpStatusCode.OK).ToString(),
                Message = ApiResponseMessage.SUCCESS
            },
            Data = item,
            Id = XCorrelationID
        };
    }
}
