"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Poppins, Pacifico, Gluten } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const gluten = Gluten({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
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
