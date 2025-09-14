/**
 * Analytics Hooks
 * Custom React hooks for common analytics tracking scenarios
 */

"use client";

import { useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { EventCategories, EventActions } from "@/config/analytics";

/**
 * Hook for automatic page view tracking
 */
export const usePageTracking = () => {
  const pathname = usePathname();
  const { trackPageView } = useAnalytics();
  const previousPathname = useRef<string>("");

  useEffect(() => {
    if (pathname && pathname !== previousPathname.current) {
      trackPageView({
        page: pathname,
        title: document.title,
        referrer: previousPathname.current || document.referrer,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, trackPageView]);
};

/**
 * Hook for tracking user interactions with elements
 */
export const useInteractionTracking = () => {
  const { trackInteraction } = useAnalytics();

  const trackClick = useCallback(
    (elementName: string, value?: number) => {
      trackInteraction(elementName, EventActions.CLICK, value);
    },
    [trackInteraction]
  );

  const trackFormInteraction = useCallback(
    (formName: string, action: string) => {
      trackInteraction(formName, action);
    },
    [trackInteraction]
  );

  const trackNavigation = useCallback(
    (linkName: string, destination: string) => {
      trackInteraction(
        `${linkName} -> ${destination}`,
        EventActions.LINK_CLICK
      );
    },
    [trackInteraction]
  );

  return {
    trackClick,
    trackFormInteraction,
    trackNavigation,
  };
};

/**
 * Hook for e-commerce event tracking
 */
export const useEcommerceTracking = () => {
  const { trackEcommerce } = useAnalytics();

  const trackProductView = useCallback(
    (product: {
      id: string;
      name: string;
      category: string;
      price: number;
      brand?: string;
    }) => {
      trackEcommerce({
        event: "view_item",
        action: EventActions.VIEW_ITEM,
        currency: "INR",
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            category: product.category,
            quantity: 1,
            price: product.price,
            brand: product.brand || "Agro Nexis",
          },
        ],
      });
    },
    [trackEcommerce]
  );

  const trackAddToCart = useCallback(
    (product: {
      id: string;
      name: string;
      category: string;
      price: number;
      quantity: number;
      brand?: string;
    }) => {
      trackEcommerce({
        event: "add_to_cart",
        action: EventActions.ADD_TO_CART,
        currency: "INR",
        value: product.price * product.quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            category: product.category,
            quantity: product.quantity,
            price: product.price,
            brand: product.brand || "Agro Nexis",
          },
        ],
      });
    },
    [trackEcommerce]
  );

  const trackRemoveFromCart = useCallback(
    (product: {
      id: string;
      name: string;
      category: string;
      price: number;
      quantity: number;
      brand?: string;
    }) => {
      trackEcommerce({
        event: "remove_from_cart",
        action: EventActions.REMOVE_FROM_CART,
        currency: "INR",
        value: product.price * product.quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            category: product.category,
            quantity: product.quantity,
            price: product.price,
            brand: product.brand || "Agro Nexis",
          },
        ],
      });
    },
    [trackEcommerce]
  );

  const trackBeginCheckout = useCallback(
    (cart: {
      total: number;
      items: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        brand?: string;
      }>;
    }) => {
      trackEcommerce({
        event: "begin_checkout",
        action: EventActions.BEGIN_CHECKOUT,
        currency: "INR",
        value: cart.total,
        items: cart.items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          brand: item.brand || "Agro Nexis",
        })),
      });
    },
    [trackEcommerce]
  );

  const trackPurchase = useCallback(
    (transaction: {
      transactionId: string;
      total: number;
      items: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
        brand?: string;
      }>;
    }) => {
      trackEcommerce({
        event: "purchase",
        action: EventActions.PURCHASE,
        transaction_id: transaction.transactionId,
        currency: "INR",
        value: transaction.total,
        items: transaction.items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          brand: item.brand || "Agro Nexis",
        })),
      });
    },
    [trackEcommerce]
  );

  const trackViewCart = useCallback(
    (cart: { total: number; itemCount: number }) => {
      trackEcommerce({
        event: "view_cart",
        action: EventActions.VIEW_CART,
        currency: "INR",
        value: cart.total,
        customData: {
          itemCount: cart.itemCount,
        },
      });
    },
    [trackEcommerce]
  );

  return {
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackPurchase,
    trackViewCart,
  };
};

/**
 * Hook for form tracking
 */
export const useFormTracking = () => {
  const { trackFormSubmission, trackEvent } = useAnalytics();

  const trackFormStart = useCallback(
    (formName: string) => {
      trackEvent({
        event: "form_start",
        category: EventCategories.FORM,
        action: "form_start",
        label: formName,
      });
    },
    [trackEvent]
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean, errorMessage?: string) => {
      trackFormSubmission(formName, success, errorMessage);
    },
    [trackFormSubmission]
  );

  const trackFieldInteraction = useCallback(
    (formName: string, fieldName: string) => {
      trackEvent({
        event: "form_field_interaction",
        category: EventCategories.FORM,
        action: "field_focus",
        label: `${formName} - ${fieldName}`,
      });
    },
    [trackEvent]
  );

  return {
    trackFormStart,
    trackFormSubmit,
    trackFieldInteraction,
  };
};

/**
 * Hook for search tracking
 */
export const useSearchTracking = () => {
  const { trackEvent } = useAnalytics();

  const trackSearch = useCallback(
    (query: string, resultsCount?: number) => {
      trackEvent({
        event: "search",
        category: EventCategories.USER_INTERACTION,
        action: EventActions.SEARCH,
        label: query,
        value: resultsCount,
        customData: {
          searchTerm: query,
          resultsCount,
        },
      });
    },
    [trackEvent]
  );

  const trackSearchResultClick = useCallback(
    (query: string, resultId: string, position: number) => {
      trackEvent({
        event: "search_result_click",
        category: EventCategories.USER_INTERACTION,
        action: "search_result_click",
        label: `${query} -> ${resultId}`,
        value: position,
        customData: {
          searchTerm: query,
          resultId,
          position,
        },
      });
    },
    [trackEvent]
  );

  return {
    trackSearch,
    trackSearchResultClick,
  };
};

/**
 * Hook for error tracking
 */
export const useErrorTracking = () => {
  const { trackError, trackEvent } = useAnalytics();

  const trackApiError = useCallback(
    (endpoint: string, errorCode: number, errorMessage: string) => {
      trackEvent({
        event: "api_error",
        category: EventCategories.ERROR,
        action: EventActions.API_ERROR,
        label: `${endpoint} - ${errorCode}`,
        value: errorCode,
        customData: {
          endpoint,
          errorCode,
          errorMessage,
        },
      });
    },
    [trackEvent]
  );

  const trackJavaScriptError = useCallback(
    (error: Error, context?: string) => {
      trackError(error, context);
    },
    [trackError]
  );

  return {
    trackApiError,
    trackJavaScriptError,
  };
};

/**
 * Hook for engagement tracking
 */
export const useEngagementTracking = () => {
  const { trackEvent } = useAnalytics();

  const trackTimeOnPage = useCallback(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent({
        event: "time_on_page",
        category: EventCategories.ENGAGEMENT,
        action: "time_spent",
        label: window.location.pathname,
        value: timeSpent,
      });
    };
  }, [trackEvent]);

  const trackShare = useCallback(
    (platform: string, content: string) => {
      trackEvent({
        event: "share",
        category: EventCategories.ENGAGEMENT,
        action: EventActions.SHARE,
        label: `${platform} - ${content}`,
        customData: {
          platform,
          content,
        },
      });
    },
    [trackEvent]
  );

  const trackDownload = useCallback(
    (fileName: string, fileType: string) => {
      trackEvent({
        event: "file_download",
        category: EventCategories.ENGAGEMENT,
        action: EventActions.FILE_DOWNLOAD,
        label: fileName,
        customData: {
          fileName,
          fileType,
        },
      });
    },
    [trackEvent]
  );

  return {
    trackTimeOnPage,
    trackShare,
    trackDownload,
  };
};
