"use client";
import React from 'react';
import Link from 'next/link';
import { Lock, Zap } from 'lucide-react';

const UpgradeGate = ({ onReturn }) => {
    return (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-12 rounded-[40px] border-2 border-dashed border-zinc-200 animate-in fade-in duration-1000">
            <div className="w-20 h-20 bg-zinc-950 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl relative">
                <Lock className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-white animate-pulse">
                    <Zap className="w-3 h-3 fill-white text-white" />
                </div>
            </div>
            <h2 className="text-4xl font-black text-black mb-4 tracking-tighter">Advanced Analytics Locked.</h2>
            <p className="text-zinc-500 font-medium max-w-md mb-10 leading-relaxed">
                The Advanced Analytics dashboard is available for <span className="text-indigo-600 font-black">Elite & Scale</span> plans. Upgrade to see real-time monitoring and global reach metrics.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                    href="/pricing"
                    className="bg-zinc-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-black/10"
                >
                    Upgrade Now
                </Link>
                <button
                    onClick={onReturn}
                    className="text-zinc-400 hover:text-black font-black text-[10px] uppercase tracking-widest transition-colors py-4 px-8"
                >
                    Return to Library
                </button>
            </div>
        </div>
    );
};

export default UpgradeGate;
