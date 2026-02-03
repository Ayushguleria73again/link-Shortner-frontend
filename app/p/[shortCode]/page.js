"use client";
import React, { useState, use } from 'react';
import { Lock, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';

export default function PasswordGate({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const shortCode = params.shortCode;
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    // Redirect to backend with password query param
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    window.location.href = `${backendUrl}/${shortCode}?p=${password}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-zinc-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 relative">
            <Lock className="w-8 h-8 text-black" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Private Access.</h1>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">Enter the code to unlock this link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input 
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="LINK PASSWORD"
              className={`w-full bg-zinc-50 border-2 ${error ? 'border-rose-100 bg-rose-50/30' : 'border-zinc-50 group-hover:border-zinc-100'} rounded-[24px] py-6 px-8 text-sm font-black tracking-widest text-center focus:outline-none focus:border-black focus:bg-white transition-all`}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                UNLOCK DESTINATION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-12 border-t border-zinc-50 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 text-zinc-300">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">Secured by ShortyCloud</span>
           </div>
           <p className="text-[9px] text-zinc-200 font-bold text-center max-w-[240px] uppercase leading-relaxed">
             This link is encrypted. we do not store your password or session data.
           </p>
        </div>
      </div>
    </div>
  );
}
