"use client";
import React, { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { Loader2, Globe, Shield, Zap, Lock, ArrowRight, Activity, Terminal, Cpu } from 'lucide-react';
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
        const response = await api.get(`/urls/public/info/${shortCode}`);
        setLinkInfo(response.data.data);
        setLoading(false);

        // Attempt Geolocation Tracking
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                await api.post(`/urls/public/track-geo/${shortCode}`, {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                });
                console.log('Location synchronized successfully');
              } catch (trackErr) {
                console.error('Location sync failed:', trackErr);
              }
            },
            (err) => {
              console.warn('Geolocation permission denied or error:', err.message);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        }
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
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-black animate-spin opacity-20" />
            <Cpu className="w-6 h-6 text-black absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Configuring Vercel</p>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400">Booting Edge Runtime...</p>
          </div>
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

      <div className="relative z-10 w-full max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/90 backdrop-blur-2xl border border-zinc-200/50 rounded-[64px] p-16 shadow-2xl shadow-zinc-200/50 text-center"
        >
          {/* Header Branding */}
          <div className="flex flex-col items-center mb-16">
            {linkInfo.branding?.logo ? (
              <motion.img 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                src={linkInfo.branding.logo} 
                alt="Brand Logo" 
                className="h-10 w-auto mb-8 object-contain grayscale brightness-0"
              />
            ) : (
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-zinc-900/10">
                <Terminal className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">System Handshake</p>
                <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
                    LINK CONTROL.
                </h1>
            </div>
          </div>

          {/* Tactical Display */}
          <div className="bg-zinc-50/80 border border-zinc-200/50 rounded-[32px] p-10 mb-16 relative overflow-hidden group text-left">
            <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Target Node</p>
                  <p className="text-lg font-black text-black tracking-tight">
                    {new URL(linkInfo.originalUrl).hostname.toUpperCase()}
                  </p>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Protocol</p>
                  <p className="text-[10px] font-black text-black uppercase tracking-tighter flex items-center gap-2 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    Vercel Edge v2.0
                  </p>
               </div>
            </div>

            {/* Tactical Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Synchronizing Data Field</p>
                <p className="text-[11px] font-black tabular-nums text-black">{Math.round(progress)}%</p>
              </div>
              <div className="h-3 w-full bg-zinc-200/50 rounded-full overflow-hidden relative border border-zinc-200/20">
                <motion.div 
                  className="h-full absolute left-0 top-0 transition-all duration-300 ease-out rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 30px ${accentColor}60`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-200/50 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400/80">
               <div className="flex items-center gap-3">
                 <Cpu className="w-3.5 h-3.5" />
                 <span>Packet ID: {linkInfo.shortCode.toUpperCase()}</span>
               </div>
               <span className="flex items-center gap-2 text-black">
                 <Activity className="w-3.5 h-3.5 animate-pulse" />
                 Configuring Vercel
               </span>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-center gap-8 opacity-30 group-hover:opacity-50 transition-opacity">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-black" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black">End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-black" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black">Global Edge Node</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Background Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400/30"
        >
          smol protocol / elite elite elite
        </motion.div>
      </div>
    </div>
  );
}
