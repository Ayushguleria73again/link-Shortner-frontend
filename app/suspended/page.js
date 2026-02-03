"use client";
import React from 'react';
import Link from 'next/link';
import { PowerOff, ArrowLeft, ShieldAlert, ZapOff } from 'lucide-react';
import MatrixRain from '@/components/MatrixRain';

export default function SuspendedLink() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <MatrixRain />
      
      <div className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-12 relative flex justify-center">
          <div className="w-24 h-24 bg-rose-50 rounded-[40px] flex items-center justify-center relative z-10">
            <PowerOff className="w-10 h-10 text-rose-500" />
          </div>
          <div className="absolute inset-0 bg-rose-100/50 blur-[40px] rounded-full scale-75 animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-black">
          LINK <span className="text-rose-500">SUSPENDED.</span>
        </h1>
        
        <p className="text-zinc-400 font-bold text-xs uppercase tracking-[0.2em] mb-12 leading-relaxed">
          The creator has temporarily deactivated this gateway. 
          Access is currently restricted by the administrator.
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full bg-black text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 group shadow-xl shadow-black/10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to HQ
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t border-zinc-100 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 text-zinc-300">
              <ShieldAlert className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">Protocol Error - 403_DEACTIVATED</span>
           </div>
           <p className="text-[9px] text-zinc-300 font-bold text-center max-w-[280px] uppercase leading-relaxed font-mono italic">
             Data stream disconnected. All transmission packets dropped.
           </p>
        </div>
      </div>
    </div>
  );
}
