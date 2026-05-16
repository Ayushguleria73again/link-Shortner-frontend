import ResetPasswordClient from '@/components/auth/ResetPasswordClient';

export const metadata = {
  title: "Secure Reset | smol",
  description: "Update your account security credentials. Ensure your protocol access is protected with a strong, modern password.",
  robots: {
    index: false,
    follow: false,
  }
};

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;
  return <ResetPasswordClient token={token} />;
}
