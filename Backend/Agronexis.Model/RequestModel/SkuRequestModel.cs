using Agronexis.Model.EntityModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.Model.RequestModel
{
    public class SkuRequestModel
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string? SkuNumber { get; set; }
        public string? Weight { get; set; }
        public string? Barcode { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
