import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://axion-munich.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "axion Munich – Student Consulting for Start-Ups",
    template: "%s | axion Munich",
  },
  description:
    "Munich-based, student-driven consulting club. Interdisciplinary teams from Germany's top universities deliver strategy and operational consulting for early-stage start-ups.",
  keywords: [
    "student consulting",
    "Munich",
    "start-up consulting",
    "axion",
    "student-driven",
    "venture capital",
    "strategy consulting",
    "Germany",
  ],
  authors: [{ name: "axion Munich" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "axion Munich",
    title: "axion Munich – Student Consulting for Start-Ups",
    description:
      "Munich-based, student-driven consulting club. Interdisciplinary teams from Germany's top universities deliver strategy and operational consulting for early-stage start-ups.",
  },
  twitter: {
    card: "summary",
    title: "axion Munich – Student Consulting for Start-Ups",
    description:
      "Munich-based, student-driven consulting club delivering strategy and operational consulting for early-stage start-ups.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
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
        className={`${manrope.variable} ${unbounded.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
