/**
 * Analytics Enhancement Demo
 *
 * This file demonstrates the enhanced analytics capabilities that were implemented.
 * The enhanced system now captures comprehensive user context, device information,
 * session data, and performance metrics.
 */

// Example of enhanced analytics event that would be captured:
export const enhancedAnalyticsEventExample = {
  // Basic event properties
  eventName: "product_view",
  eventType: "page_view",
  timestamp: "2024-01-15T10:30:00.000Z",

  // Enhanced user context
  userId: "user_12345",
  userEmail: "user@example.com",
  userRole: "customer",

  // Page context
  page: "/products/spices/garam-masala",
  pageTitle: "Premium Garam Masala - DesiKing",
  pageReferrer: "https://google.com/search?q=garam+masala",

  // User interaction data
  scrollDepth: 75, // percentage
  timeOnPage: 45000, // milliseconds
  interactionTarget: "add-to-cart-button",
  eventSource: "user_click",
  elementAttributes: {
    productId: "garam-masala-500g",
    price: "$12.99",
    category: "spices",
  },

  // Device information
  deviceInfo: {
    type: "desktop",
    brand: "Apple",
    model: "MacBook Pro",
    operatingSystem: "macOS",
    osVersion: "14.2",
    browser: "Chrome",
    browserVersion: "120",
    screenResolution: "1920x1080",
    language: "en-US",
    timezone: "America/New_York",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...",
  },

  // Session information
  sessionInfo: {
    sessionId: "sess_abc123def456",
    isFirstSession: false,
    sessionStartTime: "2024-01-15T10:15:00.000Z",
    pageViewCount: 3,
    previousPage: "/products/spices",
    sessionDuration: 900000, // 15 minutes in milliseconds
  },

  // User profile data
  userProfile: {
    registrationDate: "2023-12-01T00:00:00.000Z",
    lastLoginDate: "2024-01-15T10:14:30.000Z",
    totalOrders: 8,
    totalSpent: 245.67,
    preferredCategories: ["spices", "organic"],
    isSubscriber: true,
  },

  // Performance metrics
  performanceData: {
    pageLoadTime: 1250, // milliseconds
    domLoadTime: 890,
    firstContentfulPaint: 650,
    timeToInteractive: 1100,
    resourceCount: 45,
    totalResourceSize: 2840000, // bytes
    cumulativeLayoutShift: 0.02,
  },

  // Location data (captured server-side from IP)
  ipAddress: "192.168.1.100",
  country: "United States",
  region: "New York",
  city: "New York",
  timeZone: "America/New_York",
};

// Example usage patterns for the enhanced analytics:
export const analyticsUsageExamples = {
  // Track product interactions with full context
  productInteraction: () => ({
    eventName: "product_interaction",
    eventType: "user_action",
    interactionTarget: "product-image",
    eventSource: "user_click",
    elementAttributes: {
      productId: "turmeric-powder-1kg",
      position: "homepage-featured",
      price: "$18.99",
    },
  }),

  // Track scroll behavior for content optimization
  scrollTracking: () => ({
    eventName: "scroll_milestone",
    eventType: "user_behavior",
    scrollDepth: 50, // 50% milestone
    timeOnPage: 30000, // 30 seconds
    eventSource: "scroll_tracking",
  }),

  // Track performance issues
  performanceTracking: () => ({
    eventName: "page_performance",
    eventType: "technical_metric",
    performanceData: {
      pageLoadTime: 3000, // Slow load - might need optimization
      firstContentfulPaint: 2100,
      cumulativeLayoutShift: 0.15, // High CLS - layout stability issue
    },
  }),

  // Track user journey
  journeyTracking: () => ({
    eventName: "user_journey_step",
    eventType: "navigation",
    page: "/checkout/payment",
    previousPage: "/checkout/shipping",
    sessionInfo: {
      pageViewCount: 12,
      sessionDuration: 1800000, // 30 minutes - engaged user
    },
  }),
};

/**
 * Benefits of Enhanced Analytics:
 *
 * 1. User Experience Optimization:
 *    - Track scroll depth to understand content engagement
 *    - Monitor time on page for content effectiveness
 *    - Identify drop-off points in user journey
 *
 * 2. Performance Monitoring:
 *    - Real user performance data (RUM)
 *    - Core Web Vitals tracking
 *    - Resource usage optimization
 *
 * 3. Personalization:
 *    - User profile data for recommendations
 *    - Behavioral patterns for targeted content
 *    - Device-specific optimizations
 *
 * 4. Business Intelligence:
 *    - Geographic user distribution
 *    - Session quality metrics
 *    - Conversion funnel analysis
 *
 * 5. Technical Insights:
 *    - Browser/OS usage patterns
 *    - Network performance by region
 *    - Device-specific issues
 */
