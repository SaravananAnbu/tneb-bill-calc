import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: {
    default: "TNEB Bill Calculator - Calculate Tamil Nadu Electricity Board Bill",
    template: "%s | TNEB Bill Calculator",
  },
  description: "Free TNEB electricity bill calculator for Tamil Nadu. Calculate domestic and commercial electricity bills based on current TNEB tariff rates. Supports single meter and submeter calculations.",
  keywords: [
    "TNEB bill calculator",
    "Tamil Nadu electricity bill",
    "TNEB tariff calculator",
    "electricity bill calculator",
    "TNEB rates",
    "Tamil Nadu electricity rates",
    "domestic electricity bill",
    "commercial electricity bill",
    "TANGEDCO bill calculator",
    "electricity bill estimation",
    "TNEB online calculator",
    "Tamil Nadu electricity tariff",
    "submeter bill calculator",
  ],
  authors: [{ name: "TNEB Bill Calculator" }],
  creator: "TNEB Bill Calculator",
  publisher: "TNEB Bill Calculator",
  metadataBase: new URL("https://tneb-calc.netlify.app"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TNEB Calculator",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["ta_IN"],
    url: "https://tneb-calc.netlify.app",
    siteName: "TNEB Bill Calculator",
    title: "TNEB Bill Calculator - Calculate Tamil Nadu Electricity Board Bill",
    description: "Free TNEB electricity bill calculator for Tamil Nadu. Calculate domestic and commercial electricity bills based on current TNEB tariff rates.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TNEB Bill Calculator - Calculate your electricity bill",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TNEB Bill Calculator - Calculate Tamil Nadu Electricity Board Bill",
    description: "Free TNEB electricity bill calculator for Tamil Nadu. Calculate domestic and commercial electricity bills.",
    images: ["/og-image.png"],
    creator: "@tnebbillcalc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "utilities",
  // Add Google Search Console verification code here when available
  // verification: {
  //   google: "your-verification-code",
  //   yandex: "your-yandex-verification-code",
  //   bing: "your-bing-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
