using Microsoft.Extensions.Configuration;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.ExternalApi
{
    public class ExternalUtility
    {
        private readonly string _key;
        private readonly string _secret;

        public ExternalUtility(IConfiguration configuration)
        {
            _key = configuration["Razorpay:Key"];
            _secret = configuration["Razorpay:Secret"];
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

    }
}
