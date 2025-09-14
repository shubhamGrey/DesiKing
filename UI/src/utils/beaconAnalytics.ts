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
  }

  /**
   * Initialize beacon analytics service
   */
  private initializeBeaconAnalytics(): void {
    if (typeof window === "undefined" || !analyticsConfig.isEnabled) {
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
  }): void {
    if (!this.isInitialized) return;

    const analyticsEvent: AnalyticsEvent = {
      ...eventData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
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

    // Flush if queue is full
    if (this.eventQueue.length >= DEFAULT_CONFIG.batchSize) {
      this.flushEvents();
    }
  }

  /**
   * Start periodic flush timer
   */
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, DEFAULT_CONFIG.flushInterval);
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
   * Send events to custom analytics endpoint
   */
  private async sendToCustomEndpoint(
    events: AnalyticsEvent[],
    useBeacon = false
  ): Promise<void> {
    if (!analyticsConfig.customEndpoint) return;

    const payload = JSON.stringify({
      events,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    if (useBeacon && navigator.sendBeacon) {
      // Use beacon API for reliable delivery
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(analyticsConfig.customEndpoint, blob);
    } else {
      // Use fetch for regular requests
      await fetch(analyticsConfig.customEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        keepalive: true,
      });
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
