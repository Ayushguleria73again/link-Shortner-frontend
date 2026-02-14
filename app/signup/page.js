"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, ArrowRight, ShieldCheck, Eye, EyeOff, Mail, Key } from 'lucide-react';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: Signup, 2: OTP
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '', 
    phoneNumber: '',
    password: '', 
    confirmPassword: '',
    acceptedTerms: false
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        acceptedTerms: formData.acceptedTerms
      });
      setStep(2); // Move to OTP step
      setSuccess('Verification code sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/verify', {
        email: formData.email,
        otp
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/resend-otp', { email: formData.email });
      setSuccess('New code sent to your email.');
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-white uppercase tracking-tight">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              Join.
              <ShieldCheck className="w-8 h-8 text-black" />
            </h1>
            <p className="text-zinc-400 text-xs font-bold tracking-widest">Create your secure account.</p>
          </div>

          {error && (
            <div className="bg-black text-white px-4 py-3 rounded-xl mb-8 text-[10px] font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">First Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">Last Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                placeholder="+91 98765 43210"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>

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
                  minLength={6}
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

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 pr-12 text-black focus:outline-none focus:border-black transition-all font-medium normal-case"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                required
                id="terms"
                checked={formData.acceptedTerms}
                onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-zinc-200 text-black focus:ring-black transition-all cursor-pointer"
              />
              <label htmlFor="terms" className="text-[10px] font-bold text-zinc-400 leading-tight cursor-pointer select-none">
                I UNDERSTAND AND ACCEPT THE <Link href="/terms" className="text-black hover:underline">TERMS AND CONDITIONS</Link> OF OPERATION.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-800"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    CREATE ACCOUNT
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="relative py-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-white px-4 text-zinc-400">Or Continue With</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}/api/auth/google`}
                  className="flex items-center justify-center gap-3 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-white hover:border-black transition-all group"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5 object-contain" alt="Google" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}/api/auth/facebook`}
                  className="flex items-center justify-center gap-3 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-white hover:border-black transition-all group"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-5 h-5" alt="Facebook" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Facebook</span>
                </button>
              </div>
            </div>
          </form>

          <p className="mt-12 text-zinc-400 text-[10px] font-bold tracking-widest text-center">
            ALREADY REGISTERED?{' '}
            <Link href="/login" className="text-black hover:underline ml-1">LOG IN</Link>
          </p>
        </div>
      </div>
    );
  }

  // OTP Verification Step
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-white uppercase tracking-tight">
      <div className="w-full max-w-sm">
        <div className="mb-12">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-black mb-2">Verify.</h1>
          <p className="text-zinc-400 text-xs font-bold tracking-widest">We've sent a code to <span className="text-black normal-case">{formData.email}</span></p>
        </div>

        {error && (
          <div className="bg-black text-white px-4 py-3 rounded-xl mb-8 text-[10px] font-bold text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl mb-8 text-[10px] font-bold text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400">6-Digit Code</label>
            <div className="relative">
              <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
              <input
                type="text"
                required
                maxLength={6}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-5 px-16 text-center text-2xl font-black tracking-[0.5em] text-black focus:outline-none focus:border-black transition-all"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full bg-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50 disabled:bg-zinc-100 disabled:text-zinc-400"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                VERIFY NOW
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center text-[10px] font-bold tracking-widest text-zinc-400">
          DIDN'T RECEIVE IT?{' '}
          <button onClick={handleResendOtp} disabled={loading} className="text-black hover:underline ml-1 uppercase">RESEND CODE</button>
        </div>
      </div>
    </div>
  );
}
