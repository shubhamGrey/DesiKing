using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.Extensions.Configuration;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Agronexis.ExternalApi
{
    public class ExternalUtility
    {
        private readonly string _key;
        private readonly string _secret;
        private readonly IConfiguration _configuration;

        public ExternalUtility(IConfiguration configuration)
        {
            _key = configuration["Razorpay:Key"];
            _secret = configuration["Razorpay:Secret"];
            _configuration = configuration;
        }
        public string RazorPayCreateOrder(decimal amount, string currency)
        {
            try
            {
                RazorpayClient client = new RazorpayClient(_key, _secret);

                var options = new Dictionary<string, object>
                                    {
                                        { "amount", (int)(amount * 100) }, // amount in paise
                                        { "currency", (currency) },
                                        { "receipt", Guid.NewGuid().ToString() },
                                        { "payment_capture", 1 }
                                    };

                Order order = client.Order.Create(options);
                return order["id"].ToString(); // Return Razorpay Order ID
            }
            catch (Exception ex)
            {
                Console.WriteLine("Razorpay Error: " + ex.Message);
            }
            return null;
        }

        public bool RazorPayVerifyPayment(string orderId, string paymentId, string signature)
        {
            string secret = _secret;
            string generatedSignature = GetSignature(orderId + "|" + paymentId, secret);
            return generatedSignature == signature;
        }

        private static string GetSignature(string text, string key)
        {
            var encoding = new UTF8Encoding();
            byte[] keyByte = encoding.GetBytes(key);
            byte[] messageBytes = encoding.GetBytes(text);

            using (var hmacsha256 = new System.Security.Cryptography.HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                return BitConverter.ToString(hashmessage).Replace("-", "").ToLower();
            }
        }

        public RefundPaymentResponseModel RazorPayRefundPayment(string paymentId, int amountInPaise = 0)
        {
            RefundPaymentResponseModel refundPaymentResponseModel = new();
            try
            {
                var client = new RazorpayClient(_key, _secret);

                Dictionary<string, object> options = [];

                // Optional: specify refund amount (in paise). If omitted, full refund is issued.
                if (amountInPaise > 0)
                {
                    options.Add("amount", amountInPaise);
                }

                Razorpay.Api.Refund refund = client.Payment.Fetch(paymentId).Refund(options);

                // Save refund info to your database here
                refundPaymentResponseModel.RefundId = refund["id"].ToString();
                refundPaymentResponseModel.Status = refund["status"].ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Razorpay Error: " + ex.Message);
            }

            return refundPaymentResponseModel;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            try
            {
                var smtpHost = _configuration["SmtpSettings:Server"];
                var smtpPort = int.Parse(_configuration["SmtpSettings:Port"]);
                var senderEmail = _configuration["SmtpSettings:SenderEmail"];
                var senderName = _configuration["SmtpSettings:SenderName"];
                var username = _configuration["SmtpSettings:Username"];
                var password = _configuration["SmtpSettings:Password"];

                var client = new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = true
                };
                // Force using IPv4
                client.TargetName = "STARTTLS/smtp.hostinger.com";
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;


                var message = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };

                message.To.Add(toEmail);
                await client.SendMailAsync(message);
            }
            catch (Exception ex)
            {

            }
        }

        public async Task<PickupBookingResponseModel> CreatePickupBooking(PickupBookingRequestModel request, string xCorrelationId)
        {
            try
            {
                var appKey = _configuration["Trackon:AppKey"];
                var userId = _configuration["Trackon:UserId"];
                var password = _configuration["Trackon:Password"];
                var baseUrl = _configuration["Trackon:BookingUrl"] ?? "http://trackon.in:5455/CrmApi/Crm/UploadPickupRequestWithoutDockNo";

                if (string.IsNullOrWhiteSpace(appKey) || string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(password))
                    throw new RepositoryException("Trackon booking API credentials missing.", xCorrelationId);

                // validate required fields minimally (repository can be lenient; controller/service can validate more)
                if (request == null)
                    throw new RepositoryException("Pickup booking request is null.", xCorrelationId);

                if (string.IsNullOrWhiteSpace(request.SerialNo) ||
                    string.IsNullOrWhiteSpace(request.ActionType) ||
                    string.IsNullOrWhiteSpace(request.AddressLine1) ||
                    string.IsNullOrWhiteSpace(request.City) ||
                    string.IsNullOrWhiteSpace(request.PinCode) ||
                    string.IsNullOrWhiteSpace(request.MobileNo) ||
                    string.IsNullOrWhiteSpace(request.DocType) ||
                    string.IsNullOrWhiteSpace(request.TypeOfService) ||
                    string.IsNullOrWhiteSpace(request.Weight) ||
                    string.IsNullOrWhiteSpace(request.NoOfPieces) ||
                    string.IsNullOrWhiteSpace(request.ServiceType))
                {
                    throw new RepositoryException("Missing mandatory fields for pickup booking.", xCorrelationId);
                }

                // Build request payload expected by Trackon
                var payload = new Dictionary<string, object>
                                {
                                    { "Appkey", appKey },
                                    { "userId", userId },
                                    { "password", password },
                                    { "SerialNo", request.SerialNo },
                                    { "RefNo", request.RefNo ?? string.Empty },
                                    { "ActionType", request.ActionType },
                                    { "CustomerCode", userId ?? string.Empty },
                                    { "ClientName", request.ClientName ?? string.Empty },
                                    { "AddressLine1", request.AddressLine1 },
                                    { "AddressLine2", request.AddressLine2 ?? string.Empty },
                                    { "City", request.City },
                                    { "PinCode", request.PinCode },
                                    { "MobileNo", request.MobileNo },
                                    { "Email", request.Email ?? string.Empty },
                                    { "DocType", request.DocType },
                                    { "TypeOfService", request.TypeOfService },
                                    { "Weight", request.Weight },
                                    { "InvoiceValue", request.InvoiceValue ?? "0" },
                                    { "NoOfPieces", request.NoOfPieces },
                                    { "ItemName", request.ItemName ?? string.Empty },
                                    { "Remark", request.Remark ?? string.Empty },
                                    { "PickupCustCode", request.PickupCustCode ?? string.Empty },
                                    { "PickupCustName", request.PickupCustName ?? string.Empty },
                                    { "PickupAddr", request.PickupAddr ?? string.Empty },
                                    { "PickupCity", request.PickupCity ?? string.Empty },
                                    { "PickupState", request.PickupState ?? string.Empty },
                                    { "PickupPincode", request.PickupPincode ?? string.Empty },
                                    { "PickupPhone", request.PickupPhone ?? string.Empty },
                                    { "ServiceType", request.ServiceType }
                                };

                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var httpResponse = await httpClient.PostAsync(baseUrl, content);

                if (!httpResponse.IsSuccessStatusCode)
                    throw new RepositoryException($"Trackon booking API returned {(int)httpResponse.StatusCode} - {httpResponse.ReasonPhrase}", xCorrelationId);

                var json = await httpResponse.Content.ReadAsStringAsync();

                var bookingResponse = JsonSerializer.Deserialize<PickupBookingResponseModel>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (bookingResponse == null)
                {
                    // If Trackon returns different shape, you might want to parse via JsonDocument to map DocketNo field
                    throw new RepositoryException("Invalid response from Trackon booking API.", xCorrelationId);
                }

                return bookingResponse;
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while creating pickup booking for SerialNo: {request?.SerialNo}", xCorrelationId, ex);
            }
        }

        public async Task<ShipmentLabelResponseModel> GenerateShipmentLabel(string awbNo, string xCorrelationId)
        {
            try
            {
                var appKey = _configuration["Trackon:AppKey"];
                var userId = _configuration["Trackon:UserId"];
                var password = _configuration["Trackon:Password"];
                var baseUrl = _configuration["Trackon:LabelUrl"] ?? "http://trackon.in:5456/CrmApi/Crm/GenerateSoftdataLabel3x3";

                if (string.IsNullOrWhiteSpace(appKey) || string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(password))
                    throw new RepositoryException("Trackon API credentials missing.", xCorrelationId);

                var requestBody = new
                {
                    AWBNo = awbNo,
                    Appkey = appKey,
                    userId = userId,
                    password = password
                };

                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, content);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException($"Trackon Label API returned {response.StatusCode}", xCorrelationId);

                var json = await response.Content.ReadAsStringAsync();

                var result = JsonSerializer.Deserialize<ShipmentLabelResponseModel>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (result == null)
                    throw new RepositoryException("Invalid response received from Trackon Label API.", xCorrelationId);

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while generating shipment label for AWB: {awbNo}", xCorrelationId, ex);
            }
        }

        public async Task<string> DTDC_GenerateToken(string username, string password, string xCorrelationId)
        {
            try
            {
                var url = _configuration["DTDC:TokenUrl"];

                if (string.IsNullOrWhiteSpace(url))
                    throw new RepositoryException("DTDC Token API URL missing in configuration.", xCorrelationId);

                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                    throw new RepositoryException("DTDC authentication credentials missing.", xCorrelationId);

                // Construct API URL
                var finalUrl = $"{url}?username={username}&password={password}";

                using var httpClient = new HttpClient();

                var response = await httpClient.GetAsync(finalUrl);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException(
                        $"DTDC Token API returned {response.StatusCode}",
                        xCorrelationId
                    );

                return await response.Content.ReadAsStringAsync();
            }
            catch (RepositoryException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("DTDC Token API error", xCorrelationId, ex);
            }
        }

        public async Task<DTDC_PincodeResponseModel> DTDC_CheckPincode(ValidatePincodeRequest request, string xCorrelationId)
        {
            try
            {
                var url = _configuration["DTDC:PincodeUrl"];

                var payload = new DTDC_PincodeRequestModel
                {
                    OrgPincode = request.FromPincode,
                    DesPincode = request.ToPincode
                };

                using var httpClient = new HttpClient();
                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException($"DTDC Pincode API returned {response.StatusCode}", xCorrelationId);

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<DTDC_PincodeResponseModel>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("DTDC Pincode API error", xCorrelationId, ex);
            }
        }
        public async Task<string> DTDC_CreateShipment(DtdcSoftDataOrderRequestModel request, string xCorrelationId)
        {
            try
            {
                var url = _configuration["DTDC:OrderUrl"];
                var apiKey = _configuration["DTDC:ApiKey"];

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("api-key", apiKey);

                var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

                var response = await client.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException($"DTDC Order API returned {response.StatusCode}", xCorrelationId);

                var json = await response.Content.ReadAsStringAsync();
                return json;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("DTDC Order Upload error", xCorrelationId, ex);
            }
        }
        public async Task<byte[]> DTDC_GenerateShipmentLabel(DTDC_ShipmentLabelRequestModel request, string xCorrelationId)
        {
            try
            {
                var url = _configuration["DTDC:LabelUrl"];
                var apiKey = _configuration["DTDC:ApiKey"];

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("api-key", apiKey);

                var finalUrl = $"{url}?reference_number={request.AwbNo}&label_code={request.LabelCode}&label_format={request.LabelFormat}";

                var response = await client.GetAsync(finalUrl);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException($"DTDC Label API returned {response.StatusCode}", xCorrelationId);

                return await response.Content.ReadAsByteArrayAsync();
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error generating DTDC Label for {request.AwbNo}", xCorrelationId, ex);
            }
        }
        public async Task<string> DTDC_CancelShipment(DTDC_CancelConsignmentRequestModel request, string xCorrelationId)
        {
            try
            {
                var url = _configuration["DTDC:CancelUrl"];
                var apiKey = _configuration["DTDC:ApiKey"];
                var customerCode = _configuration["DTDC:CustomerCode"];

                //var payload = new
                //{
                //    AWBNo = new[] { awbNo },
                //    CustomerCode = customerCode
                //};

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("api-key", apiKey);

                var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

                var response = await client.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException("DTDC Cancel API failed", xCorrelationId);

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"DTDC Cancel shipment error", xCorrelationId, ex);
            }
        }
        public async Task<string> DTDC_GetTrackingToken(string username, string password, string xCorrelationId)
        {
            try
            {
                var url = _configuration["DTDC:TrackingTokenUrl"];

                var finalUrl = $"{url}?username={username}&password={password}";

                using var client = new HttpClient();

                var response = await client.GetAsync(finalUrl);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException("DTDC authentication failed", xCorrelationId);

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("DTDC token API error", xCorrelationId, ex);
            }
        }
        public async Task<string> DTDC_GetTracking(string awbNo, string token, string xCorrelationId)
        {
            try
            {
                var url = _configuration["DTDC:TrackingUrl"];

                var payload = new DTDC_TrackingRequestModel
                {
                    Strcnno = awbNo
                };

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("X-Access-Token", token);

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                var response = await client.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException("DTDC tracking request failed", xCorrelationId);

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"DTDC tracking error for {awbNo}", xCorrelationId, ex);
            }
        }


    }
}
