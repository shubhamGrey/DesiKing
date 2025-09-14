"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";
import { poppins } from "@/styles/fonts";
import { NotificationProvider } from "@/components/NotificationProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CartProvider } from "@/contexts/CartContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { GlobalClickTracker } from "@/components/GlobalClickTracker";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <head>
        <title>
          Agro Nexis - Top Brand of Spices &amp; Processed Foods in India
        </title>
        <link rel="icon" href="/AgroNexisGreen.png" />
      </head>
      <body
        className={poppins.className}
        style={{ backgroundColor: "#fffaf0", margin: "0px" }}
      >
        <ThemeProvider theme={theme}>
          <ErrorBoundary showDetails={process.env.NODE_ENV === "development"}>
            <NotificationProvider>
              <AnalyticsProvider>
                <GlobalClickTracker>
                  <CartProvider>
                    {!isAuthPage && <Header />}
                    <main>{children}</main>
                    {!isAuthPage && <Footer />}
                  </CartProvider>
                </GlobalClickTracker>
              </AnalyticsProvider>
            </NotificationProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
