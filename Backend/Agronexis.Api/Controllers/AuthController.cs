using Agronexis.Business.Configurations;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IConfigService _configService;

        public AuthController(IConfigService configService)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
        }

        [HttpPost("user-login")]
        public async Task<ActionResult<ApiResponseModel>> UserLogin([FromBody] LoginRequestModel model)
        {
            SetXCorrelationId();

            try
            {
                if (model == null)
                {
                    return new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            Code = ((int)ServerStatusCodes.BadRequest).ToString(),
                            Message = "Login model cannot be null"
                        }
                    };
                }

                if (!ModelState.IsValid)
                {
                    return new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            Code = ((int)ServerStatusCodes.BadRequest).ToString(),
                            Message = "Invalid model state"
                        }
                    };
                }

                var item = await _configService.UserLogin(model, XCorrelationID);

                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = item == null
                            ? ((int)ServerStatusCodes.Unauthorized).ToString()
                            : ((int)ServerStatusCodes.Ok).ToString(),
                        Message = item == null
                            ? "Invalid credentials provided"
                            : ApiResponseMessage.SUCCESS
                    },
                    Data = item
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = ((int)ServerStatusCodes.InternalServerError).ToString(),
                        Message = $"Error during user login: {ex.Message}"
                    }
                };
            }
        }

        [HttpPost("user-registration")]
        public async Task<ActionResult<ApiResponseModel>> UserRegistration([FromBody] RegistrationRequestModel model)
        {
            SetXCorrelationId();

            try
            {
                if (model == null)
                {
                    return new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            Code = ((int)ServerStatusCodes.BadRequest).ToString(),
                            Message = "Registration model cannot be null"
                        }
                    };
                }

                if (!ModelState.IsValid)
                {
                    return new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            Code = ((int)ServerStatusCodes.BadRequest).ToString(),
                            Message = "Invalid model state"
                        }
                    };
                }

                var item = await _configService.UserRegistration(model, XCorrelationID);

                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = item == null
                            ? ((int)ServerStatusCodes.BadRequest).ToString()
                            : ((int)ServerStatusCodes.Ok).ToString(),
                        Message = item == null
                            ? "Registration failed. User may already exist or invalid data provided"
                            : ApiResponseMessage.SUCCESS
                    },
                    Data = item
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = ((int)ServerStatusCodes.InternalServerError).ToString(),
                        Message = $"Error during registration: {ex.Message}"
                    }
                };
            }
        }

        [HttpGet("user-profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponseModel>> GetUserProfile()
        {
            SetXCorrelationId();

            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return new ApiResponseModel
                    {
                        Info = new ApiResponseInfoModel
                        {
                            Code = ((int)ServerStatusCodes.Unauthorized).ToString(),
                            Message = "Invalid user token"
                        }
                    };
                }

                var userProfile = await _configService.GetUserProfile(Guid.Parse(userId), XCorrelationID);

                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = userProfile == null
                            ? ((int)ServerStatusCodes.NotFound).ToString()
                            : ((int)ServerStatusCodes.Ok).ToString(),
                        Message = userProfile == null
                            ? ApiResponseMessage.DATANOTFOUND
                            : ApiResponseMessage.SUCCESS
                    },
                    Data = userProfile
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = ((int)ServerStatusCodes.InternalServerError).ToString(),
                        Message = $"Error retrieving user profile: {ex.Message}"
                    }
                };
            }
        }

        [HttpPut("user-profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponseModel>> UpdateUserProfile([FromBody] RegistrationRequestModel model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model), "Update model cannot be null");

            // Additional validation for profile updates
            if (!model.Id.HasValue)
                throw new ArgumentException("User ID is required for profile updates");

            if (string.IsNullOrWhiteSpace(model.FirstName) || string.IsNullOrWhiteSpace(model.LastName) ||
                string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.MobileNumber))
                throw new ArgumentException("FirstName, LastName, Email, and MobileNumber are required");

            if (!ModelState.IsValid)
                throw new ArgumentException("Invalid model state");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid user token");

            // Ensure the user can only update their own profile
            if (model.Id.Value != Guid.Parse(userId))
                return Forbid("You can only update your own profile");

            var correlationId = GetCorrelationId();
            var updatedProfile = await _configService.UpdateUserProfile(model, correlationId);

            if (updatedProfile == null)
                return NotFound("User profile not found");

            return Ok(CreateSuccessResponse(updatedProfile));
        }
    }
}
