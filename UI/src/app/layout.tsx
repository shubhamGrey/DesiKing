import { ReactNode } from "react";
import { poppins } from "@/styles/fonts";
import AppShell from "@/components/AppShell";
import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DesiKing - Top Brand of Spices & Processed Foods in India",
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
