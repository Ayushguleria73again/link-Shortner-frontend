"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Password mismatch detected.');
    }
    if (password.length < 6) {
      return setError('Security threshold not met. Minimum 6 characters.');
    }

    setLoading(true);
    setError('');

    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Token expired or invalid protocol link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center px-6 bg-white uppercase tracking-tight">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h1 className="text-5xl font-black mb-3">Secure.</h1>
          <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Set your new account password</p>
        </div>

        {error && (
          <div className="bg-black text-white px-4 py-3 rounded-xl mb-12 text-[10px] font-bold text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-4">Update Successful</h3>
            <p className="text-zinc-500 text-xs font-bold tracking-widest normal-case mb-8">
              Your security protocols have been updated. You can now use your new credentials to access the command center.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-black text-white font-black py-4 rounded-xl hover:bg-zinc-800 transition-all"
            >
              LOG IN NOW
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 pr-12 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-800"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  UPDATE CREDENTIALS
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
