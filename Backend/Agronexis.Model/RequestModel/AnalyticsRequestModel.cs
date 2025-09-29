using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class AnalyticsPayloadRequest
    {
        [Required]
        public List<AnalyticsEventRequest> Events { get; set; } = new();

        [Required]
        public long Timestamp { get; set; }

        public string? UserAgent { get; set; }

        public string? Url { get; set; }

        // Enhanced User Details
        public string? IpAddress { get; set; }
        
        public string? Country { get; set; }
        
        public string? Region { get; set; }
        
        public string? City { get; set; }
        
        public string? TimeZone { get; set; }
        
        public string? Language { get; set; }
        
        public UserDeviceInfo? DeviceInfo { get; set; }
        
        public UserSessionInfo? SessionInfo { get; set; }
        
        // User Profile Data (when available)
        public UserProfileInfo? UserProfile { get; set; }
    }

    public class AnalyticsEventRequest
    {
        [Required]
        [StringLength(100)]
        public string Event { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; }

        [StringLength(500)]
        public string? Label { get; set; }

        public decimal? Value { get; set; }

        [Required]
        public long Timestamp { get; set; }

        [Required]
        [StringLength(100)]
        public string SessionId { get; set; }

        [StringLength(100)]
        public string? UserId { get; set; }

        public Dictionary<string, object>? CustomData { get; set; }

        // Enhanced Event Context
        [StringLength(500)]
        public string? PageReferrer { get; set; }
        
        public int? ScrollDepth { get; set; }
        
        public long? TimeOnPage { get; set; }
        
        [StringLength(200)]
        public string? InteractionTarget { get; set; }
        
        [StringLength(100)]
        public string? EventSource { get; set; } // e.g., "button_click", "form_submit", "page_view"
        
        public Dictionary<string, string>? ElementAttributes { get; set; } // HTML element attributes
        
        public PagePerformanceInfo? PerformanceData { get; set; }

        // Ecommerce specific
        [StringLength(100)]
        public string? TransactionId { get; set; }

        [StringLength(10)]
        public string? Currency { get; set; }

        public List<EcommerceItemRequest>? Items { get; set; }
    }

    public class EcommerceItemRequest
    {
        [StringLength(100)]
        public string? ItemId { get; set; }

        [StringLength(200)]
        public string? ItemName { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        [StringLength(100)]
        public string? Brand { get; set; }

        [StringLength(100)]
        public string? Variant { get; set; }
    }

    public class UserDeviceInfo
    {
        [StringLength(50)]
        public string? DeviceType { get; set; } // mobile, tablet, desktop

        [StringLength(100)]
        public string? OperatingSystem { get; set; }

        [StringLength(50)]
        public string? Browser { get; set; }

        [StringLength(20)]
        public string? BrowserVersion { get; set; }

        public int? ScreenWidth { get; set; }

        public int? ScreenHeight { get; set; }

        public int? ViewportWidth { get; set; }

        public int? ViewportHeight { get; set; }

        public bool? IsMobile { get; set; }

        public bool? IsTablet { get; set; }

        public bool? IsDesktop { get; set; }
    }

    public class UserSessionInfo
    {
        [StringLength(100)]
        public string? SessionId { get; set; }

        public long? SessionStartTime { get; set; }

        public int? PageViewsInSession { get; set; }

        public long? SessionDuration { get; set; }

        public bool? IsNewSession { get; set; }

        public bool? IsReturningUser { get; set; }

        [StringLength(500)]
        public string? EntryPage { get; set; }

        [StringLength(500)]
        public string? PreviousPage { get; set; }
    }

    public class UserProfileInfo
    {
        [StringLength(100)]
        public string? UserId { get; set; }

        [StringLength(200)]
        public string? UserName { get; set; }

        [StringLength(300)]
        public string? Email { get; set; }

        [StringLength(20)]
        public string? UserType { get; set; } // guest, registered, premium, etc.

        public DateTime? RegistrationDate { get; set; }

        public DateTime? LastLoginDate { get; set; }

        public int? TotalOrders { get; set; }

        public decimal? TotalSpent { get; set; }

        [StringLength(50)]
        public string? PreferredLanguage { get; set; }

        [StringLength(100)]
        public string? CustomerSegment { get; set; } // e.g., "high_value", "frequent_buyer"

        public List<string>? Preferences { get; set; } // user preferences/interests
    }

    public class PagePerformanceInfo
    {
        public long? PageLoadTime { get; set; }

        public long? DOMLoadTime { get; set; }

        public long? FirstContentfulPaint { get; set; }

        public long? LargestContentfulPaint { get; set; }

        public long? FirstInputDelay { get; set; }

        public double? CumulativeLayoutShift { get; set; }

        public long? TimeToInteractive { get; set; }

        public int? ResourceCount { get; set; }

        public long? TotalResourceSize { get; set; }
    }
}