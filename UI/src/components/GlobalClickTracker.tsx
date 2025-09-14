/**
 * Global Click Tracker Component
 * Automatically tracks all user clicks and interactions on the page
 */

"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { EventCategories, EventActions } from "@/config/analytics";

interface GlobalClickTrackerProps {
  children: React.ReactNode;
}

export const GlobalClickTracker: React.FC<GlobalClickTrackerProps> = ({
  children,
}) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Get element information
      const tagName = target.tagName.toLowerCase();
      const className = target.className || "";
      const id = target.id || "";
      const text = target.textContent?.trim().substring(0, 100) || "";
      const href = (target as HTMLAnchorElement).href || "";

      // Determine element type and context
      let elementType = "unknown";
      let elementContext = "";

      if (tagName === "button" || target.closest("button")) {
        elementType = "button";
        const button = tagName === "button" ? target : target.closest("button");
        elementContext = button?.textContent?.trim() || "button";
      } else if (tagName === "a" || target.closest("a")) {
        elementType = "link";
        const link =
          tagName === "a" ? (target as HTMLAnchorElement) : target.closest("a");
        elementContext = link?.href || link?.textContent?.trim() || "link";
      } else if (tagName === "img" || target.closest("img")) {
        elementType = "image";
        const img =
          tagName === "img"
            ? (target as HTMLImageElement)
            : target.closest("img");
        elementContext = img?.alt || img?.src || "image";
      } else if (
        className.includes("card") ||
        target.closest('[class*="card"]')
      ) {
        elementType = "card";
        elementContext = text || "card";
      } else if (
        className.includes("product") ||
        target.closest('[class*="product"]')
      ) {
        elementType = "product";
        elementContext = text || "product";
      } else if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
      ) {
        elementType = "form_field";
        elementContext =
          (target as HTMLInputElement).name ||
          (target as HTMLInputElement).placeholder ||
          "form_field";
      }

      // Skip tracking for certain elements
      if (
        target.closest("[data-no-analytics]") ||
        target.closest(".analytics-ignore") ||
        elementContext.length === 0
      ) {
        return;
      }

      // Track the click event
      trackEvent({
        event: "user_click",
        category: EventCategories.USER_INTERACTION,
        action: EventActions.CLICK,
        label: `${elementType}: ${elementContext}`,
        customData: {
          elementType,
          elementContext,
          tagName,
          className,
          id,
          text: text.substring(0, 50),
          href,
          page: window.location.pathname,
          coordinates: {
            x: event.clientX,
            y: event.clientY,
          },
        },
      });
    };

    const handleFormSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement;
      if (!target) return;

      const formName =
        target.name || target.id || target.className || "unknown_form";

      trackEvent({
        event: "form_interaction",
        category: EventCategories.FORM,
        action: "form_submit_attempt",
        label: formName,
        customData: {
          formName,
          page: window.location.pathname,
        },
      });
    };

    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );

      // Track scroll milestones
      if (scrollPercentage > 0 && scrollPercentage % 25 === 0) {
        trackEvent({
          event: "scroll_milestone",
          category: EventCategories.ENGAGEMENT,
          action: "scroll",
          label: `${scrollPercentage}% scrolled`,
          value: scrollPercentage,
          customData: {
            scrollPercentage,
            page: window.location.pathname,
          },
        });
      }
    };

    // Add event listeners
    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleFormSubmit, true);

    // Throttled scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 1000);
    };
    window.addEventListener("scroll", throttledScroll);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleFormSubmit, true);
      window.removeEventListener("scroll", throttledScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackEvent]);

  return <>{children}</>;
};

export default GlobalClickTracker;
