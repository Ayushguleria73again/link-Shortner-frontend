"use client";
import React, { use } from 'react';
import { Loader2 } from 'lucide-react';

export default function RedirectPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const shortCode = params.shortCode;

  React.useEffect(() => {
    if (shortCode) {
      // Direct handoff to the backend redirection engine
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://link-shortner-backend-ten.vercel.app';
      window.location.href = `${backendUrl}/${shortCode}`;
    }
  }, [shortCode]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-6 h-6 text-black animate-spin" />
        </div>
        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Redirecting to destination...
        </h1>
      </div>
    </div>
  );
}
