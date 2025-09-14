/**
 * Analytics Context and Provider
 * Provides analytics functionality throughout the React application
 */

"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { getAnalyticsInstance } from "@/utils/beaconAnalytics";
import { EventCategory, EventAction } from "@/config/analytics";

interface AnalyticsContextType {
  trackEvent: (eventData: {
    event: string;
    category: EventCategory | string;
    action: EventAction | string;
    label?: string;
    value?: number;
    customData?: Record<string, any>;
  }) => void;

  trackPageView: (pageData: {
    page: string;
    title: string;
    referrer?: string;
    customData?: Record<string, any>;
  }) => void;

  trackEcommerce: (eventData: {
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
  }) => void;

  trackInteraction: (element: string, action: string, value?: number) => void;
  trackFormSubmission: (
    formName: string,
    success: boolean,
    errorMessage?: string
  ) => void;
  trackError: (error: Error, context?: string) => void;
  setUserId: (userId: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const analytics = getAnalyticsInstance();

  useEffect(() => {
    // Track initial page view when provider mounts
    if (typeof window !== "undefined") {
      analytics.trackPageView({
        page: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      });
    }

    // Cleanup on unmount
    return () => {
      analytics.destroy();
    };
  }, [analytics]);

  const contextValue: AnalyticsContextType = {
    trackEvent: (eventData) => analytics.trackEvent(eventData),
    trackPageView: (pageData) => analytics.trackPageView(pageData),
    trackEcommerce: (eventData) => analytics.trackEcommerce(eventData),
    trackInteraction: (element, action, value) =>
      analytics.trackInteraction(element, action, value),
    trackFormSubmission: (formName, success, errorMessage) =>
      analytics.trackFormSubmission(formName, success, errorMessage),
    trackError: (error, context) => analytics.trackError(error, context),
    setUserId: (userId) => analytics.setUserId(userId),
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
