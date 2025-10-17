using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.ResponseModel
{
    public class ShipmentTrackingResponseModel
    {
        public SummaryTrackModel SummaryTrack { get; set; }
        public List<TrackingDetailModel> LstDetails { get; set; }
        public ResponseStatusModel ResponseStatus { get; set; }
    }

    public class SummaryTrackModel
    {
        public string AWBNO { get; set; }
        public string REF_NO { get; set; }
        public string BOOKING_DATE { get; set; }
        public string ORIGIN { get; set; }
        public string DESTINATION { get; set; }
        public string PRODUCT { get; set; }
        public string SERVICE_TYPE { get; set; }
        public string CURRENT_STATUS { get; set; }
        public string CURRENT_CITY { get; set; }
        public string EVENTDATE { get; set; }
        public string EVENTTIME { get; set; }
        public string TRACKING_CODE { get; set; }
        public string NDR_REASON { get; set; }
    }

    public class TrackingDetailModel
    {
        public string CURRENT_CITY { get; set; }
        public string CURRENT_STATUS { get; set; }
        public string EVENTDATE { get; set; }
        public string EVENTTIME { get; set; }
        public string TRACKING_CODE { get; set; }
    }
}
