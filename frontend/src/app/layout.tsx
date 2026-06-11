import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medikart.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MediKart — India's Modern Online Pharmacy",
    template: "%s | MediKart",
  },
  description:
    "Order genuine medicines, wellness products and health devices online. Free delivery above ₹499, prescription upload, and 24×7 pharmacist support across India.",
  keywords: [
    "online pharmacy India",
    "buy medicines online",
    "wellness products",
    "health devices",
    "prescription medicines",
    "MediKart",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "MediKart",
    title: "MediKart — India's Modern Online Pharmacy",
    description:
      "Genuine medicines, wellness essentials and health devices delivered to your doorstep.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediKart — India's Modern Online Pharmacy",
    description:
      "Genuine medicines, wellness essentials and health devices delivered to your doorstep.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
