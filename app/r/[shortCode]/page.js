"use client";
import React, { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { Loader2, Globe, Shield, Zap, Lock, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const RedirectionBackground = dynamic(() => import('@/components/RedirectionBackground'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-white -z-10" />
});

export default function RedirectionBridge({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const shortCode = params.shortCode;
  const [linkInfo, setLinkInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchLinkInfo = async () => {
      try {
        const response = await api.get(`/api/urls/public/info/${shortCode}`);
        setLinkInfo(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch link info:', err);
        setError('Link not found or inactive');
        setLoading(false);
      }
    };

    fetchLinkInfo();
  }, [shortCode]);

  useEffect(() => {
    if (!loading && !error && linkInfo) {
      const duration = 2500; // 2.5 seconds
      const interval = 25;
      const step = 100 / (duration / interval);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              window.location.href = linkInfo.originalUrl;
            }, 300);
            return 100;
          }
          return prev + step;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [loading, error, linkInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Initializing Handshake</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-black uppercase">Link Expired or Restricted</h1>
          <p className="text-zinc-500 font-medium">This secure entry point is no longer active or has been decommissioned by the administrator.</p>
          <div className="pt-8">
            <a href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:gap-4 transition-all">
              Return to Control Center <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  const accentColor = linkInfo.branding?.accentColor || "#6366f1";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* Three.js Background Layer */}
      <RedirectionBackground accentColor={accentColor} />

      <div className="relative z-10 w-full max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[48px] p-12 shadow-2xl shadow-zinc-200/50 text-center"
        >
          {/* Header Branding */}
          <div className="flex flex-col items-center mb-12">
            {linkInfo.branding?.logo ? (
              <motion.img 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                src={linkInfo.branding.logo} 
                alt="Brand Logo" 
                className="h-12 w-auto mb-6 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white fill-current" />
              </div>
            )}
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Secure Protocol</p>
                <h1 className="text-2xl font-black tracking-tight text-black">
                    Redirection in Progress
                </h1>
            </div>
          </div>

          {/* Tactical Display */}
          <div className="bg-zinc-50/50 border border-zinc-100/50 rounded-3xl p-8 mb-12 relative overflow-hidden group text-left">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Target Cluster</p>
                  <p className="text-sm font-bold text-black truncate max-w-[200px]">
                    {linkInfo.originalUrl.replace(/^https?:\/\//, '')}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-1.5 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Handshaking...
                  </p>
               </div>
            </div>

            {/* Tactical Progress Bar */}
            <div className="h-2 w-full bg-zinc-200/50 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full absolute left-0 top-0 transition-opacity duration-300 rounded-full"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 20px ${accentColor}40`
                }}
              />
            </div>

            <div className="mt-4 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-400">
               <span>ID: {linkInfo.shortCode}</span>
               <span className="flex items-center gap-2">
                 <Activity className="w-3 h-3" />
                 Synchronizing Intelligence
               </span>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-center gap-6 opacity-40">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-black" />
              <span className="text-[9px] font-black uppercase tracking-widest text-black">Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-black" />
              <span className="text-[9px] font-black uppercase tracking-widest text-black">Global Transit</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Background Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400/50"
        >
          smol. elite / spectral transit
        </motion.div>
      </div>
    </div>
  );
}
