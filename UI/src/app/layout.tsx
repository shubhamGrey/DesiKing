"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";
import { poppins } from "@/styles/fonts";

export default function RootLayout({ children }: { children: ReactNode }) {
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
          {!isAuthPage && <Header />}
          <main>{children}</main>
          {!isAuthPage && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
}
