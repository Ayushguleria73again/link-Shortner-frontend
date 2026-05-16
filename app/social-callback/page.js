import { Suspense } from 'react';
import SocialCallbackClient from '@/components/auth/SocialCallbackClient';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: "Authenticating... | smol",
  description: "Finalizing your secure social authentication protocol.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SocialCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    }>
      <SocialCallbackClient />
    </Suspense>
  );
}
