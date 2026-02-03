import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });
const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ['400', '700'],
  variable: '--font-mono'
});

export const metadata = {
  title: "ShortySaaS | Modern URL Shortener",
  description: "Scalable link management with advanced click tracking and analytics.",
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
      </body>
    </html>
  );
}
