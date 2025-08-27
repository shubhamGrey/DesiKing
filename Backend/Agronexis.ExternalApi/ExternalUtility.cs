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
    }
}
