using Agronexis.Model;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Agronexis.Business.Configurations
{
    public class SmsService
    {
        private readonly TwilioSettings _twilioSettings;

        public SmsService(IOptions<TwilioSettings> twilioSettings)
        {
            _twilioSettings = twilioSettings.Value;
            TwilioClient.Init(_twilioSettings.AccountSID, _twilioSettings.AuthToken);
        }

        public async Task SendSmsAsync(string toNumber, string message)
        {
            await MessageResource.CreateAsync(
                to: new Twilio.Types.PhoneNumber(toNumber),
                from: new Twilio.Types.PhoneNumber(_twilioSettings.FromNumber),
                body: message);
        }
    }
}
