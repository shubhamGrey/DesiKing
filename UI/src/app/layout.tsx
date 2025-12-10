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
          Agronexis - Premium Indian Spices &amp; Authentic Flavors
        </title>
        <meta 
          name="description" 
          content="Experience the rich heritage of premium Indian spices. Sourced directly from finest farms with uncompromised purity. 100% natural, authentic flavors for your kitchen." 
        />
        <meta 
          name="keywords" 
          content="indian spices, premium spices, organic spices, turmeric, red chili, garam masala, authentic spices, spice store, agronexis" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="hsl(24, 88%, 52%)" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Agronexis - Premium Indian Spices" />
        <meta property="og:description" content="Experience authentic Indian spices with uncompromised purity" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/AgroNexisGreen.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agronexis - Premium Indian Spices" />
        <meta name="twitter:description" content="Experience authentic Indian spices with uncompromised purity" />
        
        <link rel="icon" href="/AgroNexisGreen.png" />
        <link rel="apple-touch-icon" href="/AgroNexisGreen.png" />
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
