import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seyrn — Understand Your Life's Pattern",
  description:
    "Understand your life's patterns and make better choices today. AI-powered analysis built from your actual turning points. Not fortune-telling. Pattern recognition.",
  keywords: [
    "life patterns",
    "career transitions",
    "AI analysis",
    "personal growth",
    "life coaching",
    "pattern recognition",
  ],
  openGraph: {
    title: "Seyrn — Understand Your Life's Pattern",
    description:
      "Understand your life's patterns and make better choices today. AI-powered analysis built from your actual turning points. Not fortune-telling. Pattern recognition.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seyrn — Understand Your Life's Pattern",
    description:
      "Understand your life's patterns and make better choices today. AI-powered analysis built from your actual turning points. Not fortune-telling. Pattern recognition.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
