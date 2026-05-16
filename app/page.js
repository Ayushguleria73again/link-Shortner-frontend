import LandingClient from '@/components/landing/LandingClient';

export const metadata = {
  title: "smol | Professional Link Management & Analytics",
  description: "The aesthetic, data-driven link shortener for elite creators and brands. Real-time tracking, city-level analytics, and global reach in one smol package.",
  openGraph: {
    title: "smol | Professional Link Management & Analytics",
    description: "The aesthetic, data-driven link shortener for elite creators and brands.",
    url: 'https://smol.co.in',
    siteName: 'smol',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'smol - less link, more data',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  return <LandingClient />;
}
