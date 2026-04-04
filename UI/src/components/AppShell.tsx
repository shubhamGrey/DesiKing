"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";
import { NotificationProvider } from "@/components/NotificationProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { GlobalClickTracker } from "@/components/GlobalClickTracker";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary showDetails={process.env.NODE_ENV === "development"}>
        <NotificationProvider>
          <AnalyticsProvider>
            <GlobalClickTracker>
              <CartProvider>
                <WishlistProvider>
                  {!isAuthPage && <Header />}
                  <main className="page-transition">{children}</main>
                  {!isAuthPage && <Footer />}
                </WishlistProvider>
              </CartProvider>
            </GlobalClickTracker>
          </AnalyticsProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
