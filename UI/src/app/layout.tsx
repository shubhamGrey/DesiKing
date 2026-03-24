import { ReactNode } from "react";
import { poppins } from "@/styles/fonts";
import AppShell from "@/components/AppShell";
import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DesiKing - Desh ka Desi Masala",
  icons: {
    icon: "/Brand.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={poppins.className}
        style={{ backgroundColor: "#FAFAF9", margin: "0px" }}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
