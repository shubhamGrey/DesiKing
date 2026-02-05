using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class DTDC_OrderRequestModel
    {
        public List<DTDC_Consignment> Consignments { get; set; }
    }
    public class DTDC_Consignment
    {
        public string Customer_Code { get; set; }
        public string Service_Type_Id { get; set; }
        public string Load_Type { get; set; }
        public string Length { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }
        public int Num_Pieces { get; set; }
    }
}
