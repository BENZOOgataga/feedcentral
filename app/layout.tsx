import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { SpeedInsights } from "@/components/analytics/SpeedInsights";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FeedCentral - Centralized News Aggregator",
  description: "A professional RSS feed aggregator built with Next.js, offering a clean, Vercel-like interface to centralize and verify your news sources.",
  keywords: ["RSS", "news", "aggregator", "feed", "reader"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <VercelAnalytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
