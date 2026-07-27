import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "QRFlow | Premium Dynamic QR Code SaaS Platform",
  description: "Generate static and dynamic QR Codes with advanced styling, real-time URL redirection, and deep scan geo-analytics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "QRFlow | Premium Dynamic QR Code SaaS Platform",
    description: "Generate static and dynamic QR Codes with advanced styling, real-time URL redirection, and deep scan geo-analytics.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
