import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TNEB Bill Calculator",
  description: "Calculate your Tamil Nadu Electricity Board bill for domestic and commercial usage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
