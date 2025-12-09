import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OzCore vOS | Sovereign Business OS",
  description: "The Vertical Operating System for Australian Business. CRM, Compliance, Grants, and Ops in one sovereign platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} antialiased bg-slate-950 text-slate-50 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
