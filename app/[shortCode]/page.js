import RedirectionClient from '@/components/redirection/RedirectionClient';

export const metadata = {
  title: "Redirecting... | smol",
  robots: {
    index: false,
    follow: false,
  }
};

export default async function RedirectionPage({ params }) {
  const { shortCode } = await params;
  return <RedirectionClient shortCode={shortCode} />;
}
