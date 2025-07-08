using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Common.AppConfig
{
    public class AppConfigService : IAppConfig
    {
        public IConfiguration configurationBuilder { get; }
        public AppConfigService()
        {
            configurationBuilder = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        }
    }
}
