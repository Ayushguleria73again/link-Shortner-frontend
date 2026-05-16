"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SuccessClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan') || 'pro';
    const [countdown, setCountdown] = useState(5);

    const planNames = {
        'starter': 'Growth',
        'pro': 'Elite',
        'business': 'Scale'
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
            </motion.div>

            {/* Main Content Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-lg bg-white border border-zinc-100 rounded-[40px] p-12 shadow-2xl shadow-black/5 relative z-10 text-center"
            >
                {/* Success Icon Animation */}
                <div className="relative mb-10 inline-block">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2 
                        }}
                        className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center relative z-10"
                    >
                        <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </motion.div>
                    
                    {/* Animated Rings */}
                    <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 border-2 border-zinc-950 rounded-full"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 border-2 border-zinc-900 rounded-full"
                    />

                    {/* Floating Particles */}
                    <motion.div 
                        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-4 -right-4"
                    >
                        <Sparkles className="w-6 h-6 text-amber-400" />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
                            Payment Successful
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-black tracking-tight mb-4">
                        You're all set.
                    </h1>
                    <p className="text-zinc-500 font-medium text-lg mb-8 leading-relaxed">
                        Your account has been upgraded to <span className="text-black font-black">{planNames[planId] || 'Premium'}</span>. We're excited to help you grow your brand.
                    </p>
                </motion.div>

                {/* Plan Badge */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-12 border ${
                        planId === 'starter' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
                        planId === 'pro' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 
                        'bg-amber-50 border-amber-100 text-amber-700'
                    }`}
                >
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-sm font-black uppercase tracking-widest">Active: {planNames[planId]}</span>
                </motion.div>

                {/* Redirect Info */}
                <div className="space-y-4">
                    <Link 
                        href="/dashboard"
                        className="w-full bg-zinc-950 text-white flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all group shadow-xl shadow-black/10"
                    >
                        Access Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                        Redirecting in {countdown} seconds...
                    </p>
                </div>
            </motion.div>

            {/* Confetti-like Elements */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        opacity: 0, 
                        y: 0, 
                        x: 0,
                        rotate: 0 
                    }}
                    animate={{ 
                        opacity: [0, 1, 0], 
                        y: [0, (Math.random() - 0.5) * 600], 
                        x: [0, (Math.random() - 0.5) * 600],
                        rotate: 360 
                    }}
                    transition={{ 
                        duration: 2 + Math.random() * 2, 
                        repeat: Infinity,
                        delay: Math.random() * 2 
                    }}
                    className={`absolute w-2 h-2 rounded-full pointer-events-none ${
                        i % 3 === 0 ? 'bg-indigo-400' : i % 3 === 1 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ 
                        top: '50%', 
                        left: '50%' 
                    }}
                />
            ))}
        </div>
    );
}
