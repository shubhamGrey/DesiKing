/**
 * Beacon Analytics Utility
 * Handles event tracking, batching, and sending using Navigator Beacon API
 */

import {
  AnalyticsEvent,
  EcommerceEvent,
  PageViewEvent,
  analyticsConfig,
  DEFAULT_CONFIG,
  EventCategory,
  EventAction,
} from "@/config/analytics";
import { isLoggedIn, isAdmin, getUserId } from "@/utils/auth";

class BeaconAnalytics {
  private eventQueue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isInitialized = false;
  private flushTimer?: NodeJS.Timeout;
  private retryQueue: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeBeaconAnalytics();
    this.setupPageTracking();
  }

  /**
   * Setup page tracking initialization
   */
  private setupPageTracking(): void {
    if (typeof window === "undefined") return;

    // Initialize page start time if not already set
    if (!sessionStorage.getItem("page_start_time")) {
      sessionStorage.setItem("page_start_time", Date.now().toString());
    }
  }

  /**
   * Initialize beacon analytics service
   */
  private initializeBeaconAnalytics(): void {
    if (typeof window === "undefined") {
      console.log(
        "[BeaconAnalytics] Skipping initialization - window is undefined (SSR)"
      );
      return;
    }

    if (!analyticsConfig.isEnabled) {
      console.log("[BeaconAnalytics] Analytics disabled by configuration");
      return;
    }

    this.isInitialized = true;
    this.setupEventListeners();
    this.startPeriodicFlush();

    if (analyticsConfig.enableDebugMode) {
      console.log(
        "[BeaconAnalytics] Initialized with config:",
        analyticsConfig
      );
    }
  }

  /**
   * Setup global event listeners for automatic tracking
   */
  private setupEventListeners(): void {
    // Page unload - flush remaining events
    window.addEventListener("beforeunload", () => {
      this.flushEvents(true);
    });

    // Page visibility change - flush when page becomes hidden
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flushEvents(true);
      }
    });

    // Automatic scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercentage = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
            100
        );
        if (scrollPercentage > 0 && scrollPercentage % 25 === 0) {
          this.trackEvent({
            event: "scroll",
            category: "engagement",
            action: "scroll",
            label: `${scrollPercentage}%`,
            value: scrollPercentage,
          });
        }
      }, 1000);
    });
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Track custom event
   */
  trackEvent(eventData: {
    event: string;
    category: EventCategory | string;
    action: EventAction | string;
    label?: string;
    value?: number;
    customData?: Record<string, any>;
    interactionTarget?: string;
    eventSource?: string;
  }): void {
    if (!this.isInitialized) return;

    const analyticsEvent: AnalyticsEvent = {
      ...eventData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      // Enhanced event context
      pageReferrer: document.referrer || undefined,
      scrollDepth: this.getScrollDepth(),
      timeOnPage: this.getTimeOnPage(),
      performanceData: this.getPagePerformance() || {},
    };

    this.addToQueue(analyticsEvent);

    if (analyticsConfig.enableDebugMode) {
      console.log("[BeaconAnalytics] Event tracked:", analyticsEvent);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageData: {
    page: string;
    title: string;
    referrer?: string;
    customData?: Record<string, any>;
  }): void {
    if (!this.isInitialized) return;

    const pageViewEvent: PageViewEvent = {
      ...pageData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    // Also create a standard analytics event
    this.trackEvent({
      event: "page_view",
      category: "navigation",
      action: "page_view",
      label: pageData.page,
      customData: pageData.customData,
    });

    if (analyticsConfig.enableDebugMode) {
      console.log("[BeaconAnalytics] Page view tracked:", pageViewEvent);
    }
  }

  /**
   * Track e-commerce events
   */
  trackEcommerce(eventData: {
    event: string;
    action: EventAction | string;
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
    customData?: Record<string, any>;
  }): void {
    if (!this.isInitialized) return;

    const ecommerceEvent: EcommerceEvent = {
      ...eventData,
      category: "ecommerce",
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.addToQueue(ecommerceEvent);

    if (analyticsConfig.enableDebugMode) {
      console.log(
        "[BeaconAnalytics] E-commerce event tracked:",
        ecommerceEvent
      );
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, action: string, value?: number): void {
    this.trackEvent({
      event: "user_interaction",
      category: "user_interaction",
      action,
      label: element,
      value,
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmission(
    formName: string,
    success: boolean,
    errorMessage?: string
  ): void {
    this.trackEvent({
      event: "form_submit",
      category: "form",
      action: success ? "submit_success" : "submit_error",
      label: formName,
      customData: {
        success,
        errorMessage,
      },
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string): void {
    this.trackEvent({
      event: "error",
      category: "error",
      action: "error_occurred",
      label: error.message,
      customData: {
        context,
        stack: error.stack,
        name: error.name,
      },
    });
  }

  /**
   * Add event to queue
   */
  private addToQueue(event: AnalyticsEvent): void {
    this.eventQueue.push(event);

    if (analyticsConfig.enableDebugMode) {
      console.log(
        `[BeaconAnalytics] Event added to queue. Queue size: ${this.eventQueue.length}/${DEFAULT_CONFIG.batchSize}`
      );
    }

    // Flush if queue is full
    if (this.eventQueue.length >= DEFAULT_CONFIG.batchSize) {
      if (analyticsConfig.enableDebugMode) {
        console.log("[BeaconAnalytics] Queue full, flushing events");
      }
      this.flushEvents();
    }
  }

  /**
   * Start periodic flush timer
   */
  private startPeriodicFlush(): void {
    if (analyticsConfig.enableDebugMode) {
      console.log(
        `[BeaconAnalytics] Starting periodic flush timer (${DEFAULT_CONFIG.flushInterval}ms)`
      );
    }

    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        if (analyticsConfig.enableDebugMode) {
          console.log(
            `[BeaconAnalytics] Periodic flush triggered. Queue size: ${this.eventQueue.length}`
          );
        }
        this.flushEvents();
      }
    }, DEFAULT_CONFIG.flushInterval);
  }

  /**
   * Get device information
   */
  private getDeviceInfo() {
    if (typeof window === "undefined") return null;

    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
    const isDesktop = !isMobile && !isTablet;

    return {
      deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
      operatingSystem: this.getOperatingSystem(ua),
      browser: this.getBrowser(ua),
      browserVersion: this.getBrowserVersion(ua),
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      isMobile,
      isTablet,
      isDesktop,
    };
  }

  /**
   * Get session information
   */
  private getSessionInfo() {
    if (typeof window === "undefined") return null;

    const sessionStart = sessionStorage.getItem("analytics_session_start");
    const pageViews = sessionStorage.getItem("analytics_page_views");
    const isNewSession = !sessionStart;
    const entryPage = sessionStorage.getItem("analytics_entry_page");

    // Update session data
    if (isNewSession) {
      sessionStorage.setItem("analytics_session_start", Date.now().toString());
      sessionStorage.setItem("analytics_entry_page", window.location.pathname);
      sessionStorage.setItem("analytics_page_views", "1");
    } else {
      const currentPageViews = parseInt(pageViews || "1") + 1;
      sessionStorage.setItem(
        "analytics_page_views",
        currentPageViews.toString()
      );
    }

    return {
      sessionId: this.sessionId,
      sessionStartTime: sessionStart ? parseInt(sessionStart) : Date.now(),
      pageViewsInSession: parseInt(pageViews || "1"),
      sessionDuration: sessionStart ? Date.now() - parseInt(sessionStart) : 0,
      isNewSession,
      isReturningUser:
        localStorage.getItem("analytics_returning_user") === "true",
      entryPage: entryPage || window.location.pathname,
      previousPage: document.referrer || null,
    };
  }

  /**
   * Get user profile information (when available)
   */
  private getUserProfile() {
    if (typeof window === "undefined") return null;

    try {
      // Use existing auth utility functions
      const userIsLoggedIn = isLoggedIn();
      const userIsAdmin = isAdmin();

      // Extract user ID from cookies if not set via setUserId
      let userId = this.userId;
      if (!userId && userIsLoggedIn) {
        const userIdFromCookie = getUserId();
        if (userIdFromCookie) {
          userId = userIdFromCookie;
          // Update the instance userId if we found it in cookies
          this.userId = userId;
        }
      }

      const userType = userIsLoggedIn ? "registered" : "guest";

      return {
        userId,
        userType,
        isLoggedIn: userIsLoggedIn,
        isAdmin: userIsAdmin,
        preferredLanguage: navigator.language,
      };
    } catch (error) {
      console.warn("Failed to get user profile:", error);
    }

    return {
      userId: this.userId,
      userType: this.userId ? "registered" : "guest",
      isLoggedIn: false,
      isAdmin: false,
      preferredLanguage: navigator.language,
    };
  }

  /**
   * Get operating system from user agent
   */
  private getOperatingSystem(ua: string): string {
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS X")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown";
  }

  /**
   * Get browser from user agent
   */
  private getBrowser(ua: string): string {
    if (ua.includes("Chrome") && !ua.includes("Chromium")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("Opera")) return "Opera";
    return "Unknown";
  }

  /**
   * Get browser version from user agent
   */
  private getBrowserVersion(ua: string): string {
    const match = ua.match(/(Chrome|Safari|Firefox|Edge|Opera)\/(\d+)/);
    return match ? match[2] : "Unknown";
  }

  /**
   * Get current scroll depth as percentage
   */
  private getScrollDepth(): number {
    if (typeof window === "undefined") return 0;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (scrollHeight <= 0) return 0;

    return Math.round((scrollTop / scrollHeight) * 100);
  }

  /**
   * Get time spent on current page
   */
  private getTimeOnPage(): number {
    if (typeof window === "undefined") return 0;

    const pageStartTime = sessionStorage.getItem("page_start_time");
    if (!pageStartTime) {
      sessionStorage.setItem("page_start_time", Date.now().toString());
      return 0;
    }

    return Date.now() - parseInt(pageStartTime);
  }

  /**
   * Get page performance metrics
   */
  private getPagePerformance() {
    if (typeof window === "undefined" || !window.performance) return null;

    try {
      const perfData = window.performance;
      const navigation = perfData.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      // Get paint metrics
      const paintMetrics = perfData.getEntriesByType("paint");
      const fcp = paintMetrics.find(
        (metric) => metric.name === "first-contentful-paint"
      );

      // Get layout shift (if available)
      let cls = 0;
      if ("getCLS" in window) {
        // This would require web-vitals library, simplified for now
        cls = 0;
      }

      return {
        pageLoadTime: navigation
          ? Math.round(navigation.loadEventEnd - navigation.loadEventStart)
          : 0,
        domLoadTime: navigation
          ? Math.round(
              navigation.domContentLoadedEventEnd - navigation.loadEventStart
            )
          : 0,
        firstContentfulPaint: fcp ? Math.round(fcp.startTime) : 0,
        timeToInteractive: navigation
          ? Math.round(navigation.domInteractive - navigation.loadEventStart)
          : 0,
        resourceCount: perfData.getEntriesByType("resource").length,
        totalResourceSize: perfData
          .getEntriesByType("resource")
          .reduce((total, resource) => {
            return total + ((resource as any).transferSize || 0);
          }, 0),
        cumulativeLayoutShift: cls,
      };
    } catch (error) {
      console.warn("Failed to get performance data:", error);
      return null;
    }
  }

  /**
   * Flush events to analytics endpoints
   */
  private async flushEvents(useBeacon = false): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await Promise.all([
        this.sendToCustomEndpoint(eventsToSend, useBeacon),
        this.sendToGoogleAnalytics(eventsToSend),
        this.sendToFacebookPixel(eventsToSend),
      ]);

      if (analyticsConfig.enableDebugMode) {
        console.log(`[BeaconAnalytics] Flushed ${eventsToSend.length} events`);
      }
    } catch (error) {
      if (analyticsConfig.enableDebugMode) {
        console.error("[BeaconAnalytics] Error sending events:", error);
      }
      // Add failed events to retry queue
      this.retryQueue.push(...eventsToSend);
      this.scheduleRetry();
    }
  }

  /**
   * Transform events to match backend API format
   */
  private transformEventsForBackend(events: AnalyticsEvent[]): any[] {
    return events.map((event) => ({
      Event: event.event,
      Category: event.category,
      Action: event.action,
      Label: event.label,
      Value: event.value,
      Timestamp: event.timestamp,
      SessionId: event.sessionId,
      UserId: event.userId,
      CustomData: event.customData,
      PageReferrer: event.pageReferrer,
      ScrollDepth: event.scrollDepth,
      TimeOnPage: event.timeOnPage,
      InteractionTarget: event.interactionTarget,
      EventSource: event.eventSource,
      ElementAttributes: event.elementAttributes,
      PerformanceData: event.performanceData
        ? {
            PageLoadTime: event.performanceData.pageLoadTime,
            DOMLoadTime: event.performanceData.domLoadTime,
            FirstContentfulPaint: event.performanceData.firstContentfulPaint,
            LargestContentfulPaint:
              event.performanceData.largestContentfulPaint,
            FirstInputDelay: event.performanceData.firstInputDelay,
            CumulativeLayoutShift: event.performanceData.cumulativeLayoutShift,
            TimeToInteractive: event.performanceData.timeToInteractive,
            ResourceCount: event.performanceData.resourceCount,
            TotalResourceSize: event.performanceData.totalResourceSize,
          }
        : undefined,
    }));
  }

  /**
   * Send events to custom analytics endpoint
   */
  private async sendToCustomEndpoint(
    events: AnalyticsEvent[],
    useBeacon = false
  ): Promise<void> {
    if (!analyticsConfig.customEndpoint) {
      if (analyticsConfig.enableDebugMode) {
        console.warn("[BeaconAnalytics] No custom endpoint configured");
      }
      return;
    }

    if (analyticsConfig.enableDebugMode) {
      console.log(
        `[BeaconAnalytics] Sending ${events.length} events to ${analyticsConfig.customEndpoint}`
      );
      console.log("[BeaconAnalytics] Events:", events);
    }

    const transformedEvents = this.transformEventsForBackend(events);

    const payload = JSON.stringify({
      Events: transformedEvents, // Transformed and capitalized to match backend model
      Timestamp: Date.now(), // Capitalized to match backend model
      UserAgent: navigator.userAgent, // Capitalized to match backend model
      Url: window.location.href, // Capitalized to match backend model
      // Enhanced user details
      Language: navigator.language, // Capitalized to match backend model
      TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Capitalized to match backend model
      DeviceInfo: this.getDeviceInfo(), // Capitalized to match backend model
      SessionInfo: this.getSessionInfo(), // Capitalized to match backend model
      UserProfile: this.getUserProfile(), // Capitalized to match backend model
    });

    if (analyticsConfig.enableDebugMode) {
      console.log("[BeaconAnalytics] Payload:", JSON.parse(payload));
    }

    if (useBeacon && navigator.sendBeacon) {
      // Use beacon API for reliable delivery
      const blob = new Blob([payload], { type: "application/json" });
      const success = navigator.sendBeacon(
        analyticsConfig.customEndpoint,
        blob
      );

      if (analyticsConfig.enableDebugMode) {
        console.log(`[BeaconAnalytics] Beacon API result:`, success);
      }
    } else {
      try {
        // Use fetch for regular requests
        const response = await fetch(analyticsConfig.customEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
          keepalive: true,
        });

        if (analyticsConfig.enableDebugMode) {
          console.log(
            `[BeaconAnalytics] Fetch response:`,
            response.status,
            response.statusText
          );

          if (!response.ok) {
            const responseText = await response.text();
            console.error(
              "[BeaconAnalytics] API Error Response:",
              responseText
            );
          }
        }
      } catch (error) {
        if (analyticsConfig.enableDebugMode) {
          console.error("[BeaconAnalytics] Fetch error:", error);
        }
        throw error;
      }
    }
  }

  /**
   * Send events to Google Analytics
   */
  private async sendToGoogleAnalytics(events: AnalyticsEvent[]): Promise<void> {
    if (!analyticsConfig.gaTrackingId || typeof window === "undefined") return;

    // Initialize gtag if not already done
    if (!window.gtag) {
      await this.initializeGoogleAnalytics();
    }

    // Send events to GA4
    events.forEach((event) => {
      window.gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.customData,
      });
    });
  }

  /**
   * Initialize Google Analytics
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    if (!analyticsConfig.gaTrackingId) return;

    // Load gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaTrackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", analyticsConfig.gaTrackingId);
  }

  /**
   * Send events to Facebook Pixel
   */
  private async sendToFacebookPixel(events: AnalyticsEvent[]): Promise<void> {
    if (!analyticsConfig.facebookPixelId || typeof window === "undefined")
      return;

    // Skip Facebook Pixel events in this version
    // Can be implemented with proper Facebook SDK
    if (analyticsConfig.enableDebugMode) {
      console.log(
        "[BeaconAnalytics] Facebook Pixel events skipped:",
        events.length
      );
    }
  }

  /**
   * Initialize Facebook Pixel
   */
  private async initializeFacebookPixel(): Promise<void> {
    if (!analyticsConfig.facebookPixelId) return;

    // Skip Facebook Pixel initialization in this version to avoid complexity
    // Can be implemented later with proper Facebook SDK integration
    if (analyticsConfig.enableDebugMode) {
      console.log("[BeaconAnalytics] Facebook Pixel initialization skipped");
    }
  }

  /**
   * Map analytics actions to Facebook events
   */
  private mapToFacebookEvent(action: string): string {
    const mapping: Record<string, string> = {
      view_item: "ViewContent",
      add_to_cart: "AddToCart",
      begin_checkout: "InitiateCheckout",
      purchase: "Purchase",
      search: "Search",
    };
    return mapping[action] || "CustomEvent";
  }

  /**
   * Schedule retry for failed events
   */
  private scheduleRetry(): void {
    if (this.retryQueue.length === 0) return;

    setTimeout(async () => {
      const eventsToRetry = [...this.retryQueue];
      this.retryQueue = [];

      try {
        await this.sendToCustomEndpoint(eventsToRetry);
        if (analyticsConfig.enableDebugMode) {
          console.log(
            `[BeaconAnalytics] Successfully retried ${eventsToRetry.length} events`
          );
        }
      } catch (error) {
        // If retry fails, log and discard events to prevent infinite retry
        if (analyticsConfig.enableDebugMode) {
          console.error(
            "[BeaconAnalytics] Retry failed, discarding events:",
            error
          );
        }
      }
    }, DEFAULT_CONFIG.retryDelay);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushEvents(true);
  }
}

// Global analytics instance
let analyticsInstance: BeaconAnalytics | null = null;

export const getAnalyticsInstance = (): BeaconAnalytics => {
  if (!analyticsInstance) {
    analyticsInstance = new BeaconAnalytics();
  }
  return analyticsInstance;
};

export default BeaconAnalytics;

// Global type definitions for gtag and fbq
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}
