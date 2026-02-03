"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Globe, Shield, Activity, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import useRazorpay from 'react-razorpay';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PricingSection() {
    const [Razorpay] = useRazorpay();
    const router = useRouter();

    const handleUpgrade = async (planId, price) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            // 1. Create Order
            const { data: orderData } = await api.post('/payment/create-order', {
                planId,
                amount: price
            });

            if (!orderData.success) {
                toast.error('Failed to initiate payment');
                return;
            }

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Public Key
                amount: orderData.order.amount,
                currency: "INR",
                name: "Shorty SaaS",
                description: `Upgrade to ${planId.toUpperCase()} Plan`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            toast.success(verifyRes.data.message);
                            // Refresh page or user state
                            window.location.href = '/dashboard';
                        }
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#000000"
                }
            };

            const rzp1 = new Razorpay(options);
            rzp1.open();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Something went wrong');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section id="pricing" className="py-32 px-6 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 text-[10px] font-black tracking-[0.2em] text-zinc-400 mb-6 uppercase"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                        Flexible Protocols
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tight text-black mb-6"
                    >
                        Scale your <span className="text-zinc-400">influence.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 font-medium max-w-2xl mx-auto"
                    >
                        Choose the clear, predictable plan that fits your growth trajectory.
                        Redirects always work, even if you hit your analytics cap.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
                >
                    {/* FREE TIER */}
                    <PricingCard
                        variants={itemVariants}
                        name="Spark"
                        price="0"
                        planId="free"
                        description="For hobbyists helping friends."
                        features={[
                            "50 Active Links",
                            "1,000 Monthly Clicks",
                            "Basic Analytics",
                            "QR Code Generation",
                            "Community Support"
                        ]}
                        icon={<Zap className="w-5 h-5 text-zinc-400" />}
                        onUpgrade={handleUpgrade}
                    />

                    {/* STARTER TIER */}
                    <PricingCard
                        variants={itemVariants}
                        name="Growth"
                        price="9"
                        planId="starter"
                        description="For creators building an audience."
                        features={[
                            "500 Active Links",
                            "15,000 Monthly Clicks",
                            "Country & Device Data",
                            "Custom Aliases",
                            "CSV Data Export"
                        ]}
                        icon={<Activity className="w-5 h-5 text-emerald-500" />}
                        accentColor="emerald"
                        onUpgrade={handleUpgrade}
                    />

                    {/* PRO TIER (RECOMMENDED) */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[34px] opacity-75 group-hover:opacity-100 blur transition duration-1000"></div>
                        <PricingCard
                            variants={itemVariants}
                            name="Elite"
                            price="29"
                            planId="pro"
                            description="For brands dominating markets."
                            features={[
                                "Unlimited Active Links",
                                "150,000 Monthly Clicks",
                                "City-Level Geo Data",
                                "Real-time Analytics Stream",
                                "Developer API Access",
                                "Priority Email Support"
                            ]}
                            icon={<Shield className="w-5 h-5 text-indigo-500" />}
                            highlight={true}
                            accentColor="indigo"
                            onUpgrade={handleUpgrade}
                        />
                    </div>

                    {/* BUSINESS TIER */}
                    <PricingCard
                        variants={itemVariants}
                        name="Scale"
                        price="79"
                        planId="business"
                        description="For teams running operations."
                        features={[
                            "Unlimited Active Links",
                            "2,000,000 Monthly Clicks",
                            "White-label Dashboard",
                            "Multiple Custom Domains",
                            "Dedicated Account Manager",
                            "SSO & Advanced Security"
                        ]}
                        icon={<Globe className="w-5 h-5 text-amber-500" />}
                        accentColor="amber"
                        onUpgrade={handleUpgrade}
                    />
                </motion.div>
            </div>
        </section>
    );
}

function PricingCard({ name, price, planId, description, features, icon, highlight = false, accentColor = "zinc", variants, onUpgrade }) {
    const isFree = price === "0";
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (isFree) return;
        setLoading(true);
        await onUpgrade(planId, price);
        setLoading(false);
    }

    return (
        <motion.div
            variants={variants}
            className={`relative h-full bg-white p-8 rounded-[32px] border ${highlight ? 'border-transparent' : 'border-zinc-100'} shadow-xl shadow-zinc-200/50 flex flex-col`}
        >
            {highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap z-10">
                    Recommended
                </div>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl bg-${accentColor}-50`}>
                    {icon}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">{name}</h3>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter">${price}</span>
                    <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-zinc-500 text-xs font-medium mt-2 leading-relaxed h-10">{description}</p>
            </div>

            <div className="space-y-4 mb-8 flex-1">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${highlight ? 'text-indigo-500' : 'text-zinc-300'}`} />
                        <span className="text-xs font-bold text-zinc-600">{feature}</span>
                    </div>
                ))}
            </div>

            {isFree ? (
                <Link
                    href="/signup"
                    className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-100`}
                >
                    Start Free
                </Link>
            ) : (
                <button
                    onClick={handleClick}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${highlight
                        ? 'bg-black text-white hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20'
                        : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-100'
                        }`}
                >
                    {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                    {loading ? 'Processing...' : 'Get Started'}
                </button>
            )}
        </motion.div>
    );
}
