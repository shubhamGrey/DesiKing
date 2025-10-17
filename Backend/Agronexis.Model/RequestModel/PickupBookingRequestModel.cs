using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class PickupBookingRequestModel
    {
        public string SerialNo { get; set; }       // required
        public string RefNo { get; set; }          // optional
        public string ActionType { get; set; }     // required (Book/Pickup/Rpickup)
        public string CustomerCode { get; set; }   // optional
        public string ClientName { get; set; }     // optional
        public string AddressLine1 { get; set; }   // required
        public string AddressLine2 { get; set; }   // optional
        public string City { get; set; }           // required
        public string PinCode { get; set; }        // required
        public string MobileNo { get; set; }       // required
        public string Email { get; set; }          // optional
        public string DocType { get; set; }        // required ('D' or 'N')
        public string TypeOfService { get; set; }  // required (AIR/SF/PT/etc)
        public string Weight { get; set; }         // required (Number)
        public string InvoiceValue { get; set; }   // optional
        public string NoOfPieces { get; set; }     // required
        public string ItemName { get; set; }       // optional
        public string Remark { get; set; }         // optional
        public string PickupCustCode { get; set; } // conditional
        public string PickupCustName { get; set; } // conditional
        public string PickupAddr { get; set; }     // conditional
        public string PickupCity { get; set; }     // conditional
        public string PickupState { get; set; }    // optional
        public string PickupPincode { get; set; }  // conditional
        public string PickupPhone { get; set; }    // optional
        public string ServiceType { get; set; }    // required (Parcel/Standard/Prime/...)
    }
}

