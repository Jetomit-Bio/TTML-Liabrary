import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "TTMLLIB - #1 Open TTML Lyrics Database | Synced Lyrics Search",
  description: "Search and download high-quality synchronized song lyrics in TTML (Timed Text Markup Language) and LRC formats. Powered by Jetomit-Bio. Access the best free open-source database and API for music players and synchronized lyrics search.",
  keywords: [
    "TTML",
    "TTML Lyrics",
    "Synced Lyrics",
    "Timed Text Markup Language",
    "TTML Synced Lyrics",
    "Lyrics Database",
    "Lyrics API",
    "LRC to TTML",
    "Jetomit-Bio",
    "SudoAPP",
    "Open Source Lyrics",
    "Synced Lyrics Database",
    "Song Lyrics Search",
    "Free Lyrics API"
  ],
  authors: [{ name: "Jetomit-Bio", url: "https://github.com/Jetomit-Bio" }],
  creator: "Jetomit-Bio",
  publisher: "Jetomit-Bio",
  metadataBase: new URL("https://ttmllib.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TTMLLIB - #1 Open TTML Lyrics Database | Synced Lyrics Search",
    description: "Search, download, and contribute synchronized lyrics in TTML & LRC formats. Fast and open-source, created by Jetomit-Bio.",
    url: "https://ttmllib.xyz",
    siteName: "TTML Liabrary",
    images: [
      {
        url: "/ttmllogo.png",
        width: 512,
        height: 512,
        alt: "TTMLLIB Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TTMLLIB - #1 Open TTML Lyrics Database | Synced Lyrics Search",
    description: "Search, download, and contribute synchronized lyrics in TTML & LRC formats. Fast and open-source, created by Jetomit-Bio.",
    images: ["/ttmllogo.png"],
  },
  icons: {
    icon: "/ttmllogo.png",
    shortcut: "/ttmllogo.png",
    apple: "/ttmllogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
