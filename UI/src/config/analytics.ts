/**
 * Analytics Configuration
 * Central configuration for all analytics services
 */

export interface AnalyticsConfig {
  isEnabled: boolean;
  gaTrackingId?: string;
  facebookPixelId?: string;
  customEndpoint?: string;
  enableDebugMode: boolean;
  enableBeaconAnalytics: boolean;
}

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  customData?: Record<string, any>;

  // Enhanced event context
  pageReferrer?: string;
  scrollDepth?: number;
  timeOnPage?: number;
  interactionTarget?: string;
  eventSource?: string;
  elementAttributes?: Record<string, string>;
  performanceData?: {
    pageLoadTime?: number;
    domLoadTime?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    firstInputDelay?: number;
    cumulativeLayoutShift?: number;
    timeToInteractive?: number;
    resourceCount?: number;
    totalResourceSize?: number;
  };
}

export interface EcommerceEvent extends AnalyticsEvent {
  transaction_id?: string;
  currency?: string;
  value?: number;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
    brand?: string;
    variant?: string;
  }>;
}

export interface PageViewEvent {
  page: string;
  title: string;
  referrer?: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  customData?: Record<string, any>;
}

// Analytics configuration from environment variables
export const analyticsConfig: AnalyticsConfig = {
  isEnabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  customEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/analytics/track`,
  enableDebugMode: false, // Disabled for production database storage
  enableBeaconAnalytics: true,
};

// Event categories
export const EventCategories = {
  ECOMMERCE: "ecommerce",
  USER_INTERACTION: "user_interaction",
  NAVIGATION: "navigation",
  ERROR: "error",
  PERFORMANCE: "performance",
  FORM: "form",
  ENGAGEMENT: "engagement",
} as const;

// Event actions
export const EventActions = {
  // E-commerce
  VIEW_ITEM: "view_item",
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  VIEW_CART: "view_cart",

  // Navigation
  PAGE_VIEW: "page_view",
  LINK_CLICK: "link_click",
  SCROLL: "scroll",

  // User interaction
  CLICK: "click",
  FORM_SUBMIT: "form_submit",
  SEARCH: "search",
  SHARE: "share",

  // Engagement
  VIDEO_PLAY: "video_play",
  FILE_DOWNLOAD: "file_download",
  CONTACT_SUBMIT: "contact_submit",

  // Error tracking
  ERROR_BOUNDARY: "error_boundary",
  API_ERROR: "api_error",
} as const;

export type EventCategory =
  (typeof EventCategories)[keyof typeof EventCategories];
export type EventAction = (typeof EventActions)[keyof typeof EventActions];

// Default values
export const DEFAULT_CONFIG = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
} as const;
