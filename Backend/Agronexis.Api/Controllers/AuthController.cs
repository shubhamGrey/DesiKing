using Agronexis.Business.Configurations;
using Agronexis.ExternalApi;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using static Agronexis.Common.Constants;

namespace Agronexis.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IConfigService _configService;
        private readonly ExternalUtility _externalUtility;
        private readonly IConfiguration _configuration;

        public AuthController(IConfigService configService, ExternalUtility externalUtility, IConfiguration configuration)
        {
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _externalUtility = externalUtility ?? throw new ArgumentNullException(nameof(externalUtility));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        [HttpPost("userLogin")]
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

        [HttpPost("userRegistration")]
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

        [HttpGet("userProfile")]
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

        [HttpPut("userProfile")]
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

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponseModel>> ForgotPassword([FromBody] ForgotPasswordRequestModel request)
        {
            SetXCorrelationId();
            try
            {
                if (request == null || !ModelState.IsValid)
                    return new ApiResponseModel { Info = new ApiResponseInfoModel { Code = ((int)ServerStatusCodes.BadRequest).ToString(), Message = "Invalid email address" } };

                var token = await _configService.ForgotPassword(request.Email, XCorrelationID);

                if (token != null)
                {
                    var frontendBaseUrl = _configuration["FrontendBaseUrl"] ?? "https://desikingspices.com";
                    var resetLink = $"{frontendBaseUrl}/reset-password?token={token}";
                    string body = $"You requested a password reset for your DesiKing account.\n\nClick the link below to reset your password (valid for 1 hour):\n\n{resetLink}\n\nIf you did not request this, please ignore this email.";
                    await _externalUtility.SendEmailAsync(request.Email, "Reset Your DesiKing Password", body, false);
                }

                // Always return success to prevent email enumeration
                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel { Code = ((int)ServerStatusCodes.Ok).ToString(), Message = ApiResponseMessage.SUCCESS },
                    Data = "If that email is registered, you will receive a reset link shortly."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseModel { Info = new ApiResponseInfoModel { Code = ((int)ServerStatusCodes.InternalServerError).ToString(), Message = $"Error: {ex.Message}" } };
            }
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponseModel>> ResetPassword([FromBody] ResetPasswordRequestModel request)
        {
            SetXCorrelationId();
            try
            {
                if (request == null || !ModelState.IsValid)
                    return new ApiResponseModel { Info = new ApiResponseInfoModel { Code = ((int)ServerStatusCodes.BadRequest).ToString(), Message = "Invalid request" } };

                var success = await _configService.ResetPassword(request, XCorrelationID);

                return new ApiResponseModel
                {
                    Info = new ApiResponseInfoModel
                    {
                        Code = success ? ((int)ServerStatusCodes.Ok).ToString() : ((int)ServerStatusCodes.BadRequest).ToString(),
                        Message = success ? ApiResponseMessage.SUCCESS : "Invalid or expired reset token. Please request a new password reset."
                    },
                    Data = success ? "Password reset successfully. You can now log in with your new password." : null
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseModel { Info = new ApiResponseInfoModel { Code = ((int)ServerStatusCodes.InternalServerError).ToString(), Message = $"Error: {ex.Message}" } };
            }
        }
    }
}
