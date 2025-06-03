import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cellflip - Kerala's Premier Mobile Resale Platform",
    template: "%s | Cellflip"
  },
  description: "Sell your mobile devices through transparent bidding with verified vendors and agents. Kerala's most trusted mobile resale platform by Fairtreez.",
  keywords: [
    "mobile resale", 
    "phone selling", 
    "Kerala", 
    "bidding platform", 
    "smartphone marketplace",
    "device trading",
    "Fairtreez"
  ],
  authors: [{ name: "Fairtreez" }],
  creator: "Fairtreez",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://cellflip.in",
    title: "Cellflip - Kerala's Premier Mobile Resale Platform",
    description: "Sell your mobile devices through transparent bidding with verified vendors and agents.",
    siteName: "Cellflip",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cellflip - Kerala's Premier Mobile Resale Platform",
    description: "Sell your mobile devices through transparent bidding with verified vendors and agents.",
    creator: "@fairtreez",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          {children}
          <Toaster 
            position="top-right"
            richColors
            expand={false}
            duration={4000}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
