using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class DTDC_PincodeResponseModel
    {
        [JsonPropertyName("SERV_BR")]
        public List<ServiceBranch> ServiceBranches { get; set; }

        [JsonPropertyName("SERV_LIST")]
        public List<ServiceAvailability> ServiceList { get; set; }

        [JsonPropertyName("ZIPCODE_RESP")]
        public List<ZipcodeResponse> ZipcodeResponses { get; set; }

        [JsonPropertyName("SERV_FR")]
        public List<ServiceFranchise> ServiceFranchises { get; set; }

        [JsonPropertyName("SERV_LIST_DTLS")]
        public List<ServiceListDetail> ServiceListDetails { get; set; }

        [JsonPropertyName("PIN_CITY")]
        public List<PinCity> PinCities { get; set; }
    }

    public class ServiceBranch
    {
        [JsonPropertyName("CODE")]
        public string Code { get; set; }

        [JsonPropertyName("BR_NAME")]
        public string BranchName { get; set; }

        [JsonPropertyName("BR_ADDRESS")]
        public string BranchAddress { get; set; }

        [JsonPropertyName("PHONE")]
        public string Phone { get; set; }

        [JsonPropertyName("EMAIL")]
        public string Email { get; set; }

        [JsonPropertyName("LATITUDE")]
        public string Latitude { get; set; }

        [JsonPropertyName("LONGITUDE")]
        public string Longitude { get; set; }
    }


    public class ServiceAvailability
    {
        [JsonPropertyName("DC_Serviceable")]
        public string DcServiceable { get; set; }

        [JsonPropertyName("COD_Serviceable")]
        public string CodServiceable { get; set; }

        [JsonPropertyName("b2B_SERVICEABLE")]
        public string B2BServiceable { get; set; }

        [JsonPropertyName("b2C_SERVICEABLE")]
        public string B2CServiceable { get; set; }

        [JsonPropertyName("b2B_COD_Serviceable")]
        public string B2BCodServiceable { get; set; }

        [JsonPropertyName("b2C_COD_Serviceable")]
        public string B2CCodServiceable { get; set; }

        [JsonPropertyName("GEC_Serviceable")]
        public string GecServiceable { get; set; }

        [JsonPropertyName("LITE_Serviceable")]
        public string LiteServiceable { get; set; }

        [JsonPropertyName("special_Destination")]
        public string SpecialDestination { get; set; }

        [JsonPropertyName("remote_Delivery_Area")]
        public string RemoteDeliveryArea { get; set; }
    }


    public class ZipcodeResponse
    {
        [JsonPropertyName("MESSAGE")]
        public string Message { get; set; }

        [JsonPropertyName("ORGPIN")]
        public string OrgPin { get; set; }

        [JsonPropertyName("DESTPIN")]
        public string DestPin { get; set; }

        [JsonPropertyName("ORGCOUNTRY")]
        public string OrgCountry { get; set; }

        [JsonPropertyName("DESTCOUNTRY")]
        public string DestCountry { get; set; }

        [JsonPropertyName("DESTCITY")]
        public string DestCity { get; set; }

        [JsonPropertyName("DESTSTATE")]
        public string DestState { get; set; }

        [JsonPropertyName("SERVFLAG")]
        public string ServiceFlag { get; set; }

        [JsonPropertyName("SERV_COD")]
        public string CodService { get; set; }
    }
    public class ServiceFranchise
    {
        [JsonPropertyName("CODE")]
        public string Code { get; set; }

        [JsonPropertyName("FR_NAME")]
        public string FranchiseName { get; set; }

        [JsonPropertyName("FR_ADDRESS")]
        public string FranchiseAddress { get; set; }

        [JsonPropertyName("PHONE")]
        public string Phone { get; set; }

        [JsonPropertyName("EMAIL")]
        public string Email { get; set; }

        [JsonPropertyName("LATITUDE")]
        public string Latitude { get; set; }

        [JsonPropertyName("LONGITUDE")]
        public string Longitude { get; set; }
    }

    public class ServiceListDetail
    {
        [JsonPropertyName("CODE")]
        public string Code { get; set; }

        [JsonPropertyName("PCODE")]
        public string ProductCode { get; set; }

        [JsonPropertyName("NAME")]
        public string Name { get; set; }

        [JsonPropertyName("TAT")]
        public string Tat { get; set; }
    }
    public class PinCity
    {
        [JsonPropertyName("PIN")]
        public string Pin { get; set; }

        [JsonPropertyName("CITY")]
        public string City { get; set; }

        [JsonPropertyName("CITY_CODE")]
        public string CityCode { get; set; }

        [JsonPropertyName("STATE_NAME")]
        public string StateName { get; set; }

        [JsonPropertyName("STATE_CODE")]
        public string StateCode { get; set; }

        [JsonPropertyName("TALUKA_AND_DISTRICT")]
        public string TalukaAndDistrict { get; set; }

        [JsonPropertyName("PARTIALSERV_AREA_AND_CITY")]
        public string ServiceabilityStatus { get; set; }
    }

}
