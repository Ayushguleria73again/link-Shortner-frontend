import PasswordGateClient from '@/components/redirection/PasswordGateClient';

export const metadata = {
  title: "Private Access | smol",
  robots: {
    index: false,
    follow: false,
  }
};

export default async function PasswordGatePage({ params }) {
  const { shortCode } = await params;
  return <PasswordGateClient shortCode={shortCode} />;
}
