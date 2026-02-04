import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';
import CommandMenu from "@/components/CommandMenu";

const inter = Inter({ subsets: ["latin"] });
const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ['400', '700'],
  variable: '--font-mono'
});

export const metadata = {
  title: {
    default: "smol | tiny links, big data",
    template: "%s | smol"
  },
  description: "The internet's aesthetic link shortener. Tracking, analytics, and vibes included.",
  keywords: ["url shortener", "smol", "link management", "analytics", "aesthetic", "gen z"],
  authors: [{ name: "smol team" }],
  creator: "smol",
  metadataBase: new URL('https://smol.link'), // Replace with actual domain
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smol.link',
    title: 'smol | tiny links, big data',
    description: 'The aesthete\'s choice for link management. Minimalist, powerful, smol.',
    siteName: 'smol',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'smol dashboard'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'smol | tiny links, big data',
    description: 'The aesthete\'s choice for link management.',
    images: ['/og-image.png'],
    creator: '@smol_link'
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceMono.variable} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="bottom-right" theme="dark" />
        <CommandMenu />
      </body>
    </html>
  );
}
