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
    default: "ShortySaaS | Modern URL Shortener & Analytics",
    template: "%s | ShortySaaS"
  },
  description: "Enterprise-grade URL shortener with real-time analytics, city-level tracking, and audience intelligence. Scale your links with confidence.",
  keywords: ["URL Shortener", "Link Management", "Analytics", "SaaS", "Marketing Tools", "React", "Next.js"],
  authors: [{ name: "Shorty Team" }],
  creator: "ShortySaaS",
  metadataBase: new URL('https://shorty-saas.com'), // Replace with actual domain in production
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shorty-saas.com',
    title: 'ShortySaaS | Modern URL Shortener',
    description: 'Scalable link management with advanced click tracking and analytics.',
    siteName: 'ShortySaaS',
    images: [
      {
        url: '/og-image.png', // Needs to be added to public
        width: 1200,
        height: 630,
        alt: 'ShortySaaS Dashboard Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShortySaaS | Modern URL Shortener',
    description: 'Scalable link management with advanced click tracking and analytics.',
    images: ['/og-image.png'],
    creator: '@shortysaas'
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
