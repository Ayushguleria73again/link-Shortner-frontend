import { Suspense } from 'react';
import SuccessClient from '@/components/payment/SuccessClient';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: "Success! | smol",
  description: "Your payment was processed successfully. Welcome to the elite link management protocol.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
