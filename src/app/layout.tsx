import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoreVantz Solutions | Australian vSO",
  description: "Your Virtual Sovereign Officer. Better than a CSM. The intelligent, sovereign partner for Australian small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} antialiased bg-slate-50 text-slate-900 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
