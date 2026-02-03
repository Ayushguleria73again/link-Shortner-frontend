"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-white uppercase tracking-tight">
      <div className="w-full max-w-sm">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">Access.</h1>
          <p className="text-zinc-400 text-xs font-bold tracking-widest">Welcome back to Sutra.</p>
        </div>

        {error && (
          <div className="bg-black text-white px-4 py-3 rounded-xl mb-8 text-[10px] font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 pr-12 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-800"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                LOG IN
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-zinc-400 text-[10px] font-bold tracking-widest">
          NEW HERE?{' '}
          <Link href="/signup" className="text-black hover:underline ml-1">SIGN UP</Link>
        </p>
      </div>
    </div>
  );
}
