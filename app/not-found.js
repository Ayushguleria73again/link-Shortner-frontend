"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MatrixRain from '@/components/MatrixRain';
import { Terminal, MoveLeft, Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-rose-500 selection:text-white">
      <MatrixRain color="#f43f5e" /> {/* Rose Red Rain for Error */}
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>

      <div className="relative z-20 text-center max-w-2xl px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-3 px-4 py-2 border border-rose-500/30 rounded-full bg-rose-500/10 backdrop-blur-md mb-8"
        >
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-rose-500 uppercase">Page Not Found</span>
        </motion.div>

        <h1 className="text-[150px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-black mix-blend-overlay glitch-text mb-4">
            404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-mono font-bold text-zinc-400 mb-8 uppercase tracking-widest">
            System Failure
        </h2>

        <p className="text-zinc-500 max-w-md mx-auto mb-12 font-mono text-sm leading-relaxed">
            [ERROR_CODE_404]: The requested page cannot be located. The link may have been broken or removed from our system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all group"
            >
                <Terminal className="w-4 h-4" />
                Return to Dashboard
            </Link>
            
            <Link 
                href="/"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800"
            >
                <MoveLeft className="w-4 h-4" />
                Back to Safety
            </Link>
        </div>
      </div>

      <div className="absolute bottom-12 text-center w-full">
         <p className="text-[10px] text-zinc-800 font-mono">ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
      </div>
    </div>
  );
}
