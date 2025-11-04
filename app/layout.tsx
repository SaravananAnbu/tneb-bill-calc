import type { Metadata } from "next";
import "./globals.css";

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
  ],
  authors: [{ name: "TNEB Bill Calculator" }],
  creator: "TNEB Bill Calculator",
  publisher: "TNEB Bill Calculator",
  metadataBase: new URL("https://tneb-calc.netlify.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tneb-calc.netlify.app",
    siteName: "TNEB Bill Calculator",
    title: "TNEB Bill Calculator - Calculate Tamil Nadu Electricity Board Bill",
    description: "Free TNEB electricity bill calculator for Tamil Nadu. Calculate domestic and commercial electricity bills based on current TNEB tariff rates.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TNEB Bill Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TNEB Bill Calculator - Calculate Tamil Nadu Electricity Board Bill",
    description: "Free TNEB electricity bill calculator for Tamil Nadu. Calculate domestic and commercial electricity bills.",
    images: ["/og-image.png"],
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
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
