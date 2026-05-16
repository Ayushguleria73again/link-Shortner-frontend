import ForgotPasswordClient from '@/components/auth/ForgotPasswordClient';

export const metadata = {
  title: "Reset Password | smol",
  description: "Recover your smol account. Initiate the secure password reset protocol to regain access to your console.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
