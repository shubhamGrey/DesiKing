using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class DtdcSoftDataOrderRequestModel
    {
        public List<DtdcConsignment> consignments { get; set; }
    }

    public class DtdcConsignment
    {
        public string customer_code { get; set; }
        public string service_type_id { get; set; }
        public string load_type { get; set; }
        public string consignment_type { get; set; }
        public string description { get; set; }
        public string dimension_unit { get; set; }
        public string length { get; set; }
        public string width { get; set; }
        public string height { get; set; }
        public string weight_unit { get; set; }
        public string weight { get; set; }
        public string declared_value { get; set; }
        public string num_pieces { get; set; }
        public DtdcOriginDetails origin_details { get; set; }
        public DtdcDestinationDetails destination_details { get; set; }
        public string customer_reference_number { get; set; }
        public string cod_collection_mode { get; set; }
        public string cod_amount { get; set; }
        public string commodity_id { get; set; }
        public string eway_bill { get; set; }
        public bool is_risk_surcharge_applicable { get; set; }
        public string invoice_number { get; set; }
        public string invoice_date { get; set; }
        public string reference_number { get; set; }
        public List<DtdcPieceDetail> pieces_detail { get; set; }
    }

    public class DtdcOriginDetails
    {
        public string name { get; set; }
        public string phone { get; set; }
        public string alternate_phone { get; set; }
        public string address_line_1 { get; set; }
        public string address_line_2 { get; set; }
        public string pincode { get; set; }
        public string city { get; set; }
        public string state { get; set; }
    }

    public class DtdcDestinationDetails
    {
        public string name { get; set; }
        public string phone { get; set; }
        public string alternate_phone { get; set; }
        public string address_line_1 { get; set; }
        public string address_line_2 { get; set; }
        public string pincode { get; set; }
        public string city { get; set; }
        public string state { get; set; }
    }

    public class DtdcPieceDetail
    {
        public string description { get; set; }
        public string declared_value { get; set; }
        public string weight { get; set; }
        public string height { get; set; }
        public string length { get; set; }
        public string width { get; set; }
    }

}
