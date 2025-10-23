import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FeedCentral - RSS Aggregator",
  description: "Centralized RSS feed aggregator with full-text search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 text-gray-100">{children}</body>
    </html>
  );
}
