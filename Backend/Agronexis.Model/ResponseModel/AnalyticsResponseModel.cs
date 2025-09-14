using System;

namespace Agronexis.Model.ResponseModel
{
    public class AnalyticsResponseModel
    {
        public bool Success { get; set; }
        public int ProcessedEvents { get; set; }
        public long Timestamp { get; set; }
        public string? Message { get; set; }
    }
}