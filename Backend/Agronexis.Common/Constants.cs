using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Common
{
    public class Constants
    {
        public struct ApiResponseMessage
        {
            public const string SUCCESS = "success";
            public const string DATANOTFOUND = "Data Not Found";
            public const string CLAIMSMISSING = "Claims is missing";
            public const string INVALIDREQUEST = "Invalid request";
            public const string INTERNALSERVERERROR = "Internal server error";
            public const string UNAUTHORIZED = "Unauthorized access";
            public const string FORBIDDEN = "Access forbidden";
            public const string VALIDATION_FAILED = "Validation failed";
        }

        public enum ServerStatusCodes
        {
            Ok = 200,
            Created = 201,
            NoContent = 204,
            BadRequest = 400,
            Unauthorized = 401,
            Forbidden = 403,
            NotFound = 404,
            MethodNotAllowed = 405,
            RequestTimeout = 408,
            Conflict = 409,
            UnprocessableEntity = 422,
            InternalServerError = 500,
            NotImplemented = 501,
            BadGateway = 502,
            ServiceUnavailable = 503,
            GatewayTimeout = 504
        }
    }
}
