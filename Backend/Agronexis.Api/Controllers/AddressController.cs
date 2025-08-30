using Agronexis.Api.Controllers;
using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using static Agronexis.Common.Constants;

[Route("api/[controller]")]
[ApiController]
public class AddressController : BaseController
{
    private readonly IConfigService _configService;
    private readonly ILogger<AddressController> _logger;

    public AddressController(IConfigService configService, ILogger<AddressController> logger)
    {
        _configService = configService ?? throw new ArgumentNullException(nameof(configService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    [HttpGet("{userId}")]
    public ActionResult<ApiResponseModel> GetAddressesByUserId(string userId)
    {
        SetXCorrelationId();
        var addresses = _configService.GetAddressesByUserId(userId, XCorrelationID);

        return new ApiResponseModel
        {
            Info = new ApiResponseInfoModel
            {
                IsSuccess = true,
                Code = ((int)HttpStatusCode.OK).ToString(),
                Message = ApiResponseMessage.SUCCESS
            },
            Data = addresses,
            Id = XCorrelationID
        };
    }

    [HttpPost]
    public ActionResult<ApiResponseModel> SaveOrUpdateAddress([FromBody] AddressRequestModel address)
    {
        SetXCorrelationId();
        var result = _configService.SaveOrUpdateAddress(address, XCorrelationID);

        return new ApiResponseModel
        {
            Info = new ApiResponseInfoModel
            {
                IsSuccess = true,
                Code = ((int)HttpStatusCode.OK).ToString(),
                Message = ApiResponseMessage.SUCCESS
            },
            Data = result,
            Id = XCorrelationID
        };
    }

    [HttpDelete("{id}")]
    public ActionResult<ApiResponseModel> DeleteAddressById(string id)
    {
        SetXCorrelationId();
        var result = _configService.DeleteAddressById(id, XCorrelationID);

        return new ApiResponseModel
        {
            Info = new ApiResponseInfoModel
            {
                IsSuccess = true,
                Code = ((int)HttpStatusCode.OK).ToString(),
                Message = ApiResponseMessage.SUCCESS
            },
            Data = result,
            Id = XCorrelationID
        };
    }
}
