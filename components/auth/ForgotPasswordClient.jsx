"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, ArrowRight, Mail } from 'lucide-react';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('Reset protocol initiated. Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.error || 'Protocol failure. Check email accuracy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center px-6 bg-white uppercase tracking-tight">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <Link href="/login" className="text-[10px] font-black text-zinc-400 hover:text-black mb-8 inline-block tracking-widest">
            ← BACK TO LOGIN
          </Link>
          <h1 className="text-5xl font-black mb-3 mt-4">Reset.</h1>
          <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">We'll help you get back in</p>
        </div>

        {error && (
          <div className="bg-black text-white px-4 py-3 rounded-xl mb-12 text-[10px] font-bold text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="text-white w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-4">Email Sent</h3>
            <p className="text-zinc-500 text-xs font-bold tracking-widest normal-case mb-8">
              We've sent a high-security reset link to <span className="text-black font-black">{email}</span>.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-black text-white font-black py-4 rounded-xl hover:bg-zinc-800 transition-all"
            >
              RETURN TO LOGIN
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">Recovery Email</label>
              <input
                type="email"
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-800"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  SEND RESET LINK
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
