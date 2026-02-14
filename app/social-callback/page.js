"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SocialCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');

    if (token && userJson) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', userJson);
        
        // Success redirect
        router.push('/dashboard');
      } catch (err) {
        console.error('Failed to process social login:', err);
        router.push('/login?error=auth_failed');
      }
    } else {
      router.push('/login?error=missing_credentials');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Synchronizing.</h1>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">Finalizing secure protocol</p>
      </div>
      <Loader2 className="w-12 h-12 animate-spin text-black" />
    </div>
  );
}
