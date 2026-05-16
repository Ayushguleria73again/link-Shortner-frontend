import BrandedRedirectClient from '@/components/redirection/BrandedRedirectClient';

export const metadata = {
  title: "Redirection Gateway | smol",
  robots: {
    index: false,
    follow: false,
  }
};

export default async function BrandedRedirectPage({ params }) {
  const { shortCode } = await params;
  return <BrandedRedirectClient shortCode={shortCode} />;
}
