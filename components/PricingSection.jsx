"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PLANS } from '@/lib/plans';
import api from '@/lib/api';

export default function PricingSection() {
    const [userPlan, setUserPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsed = JSON.parse(user);
            setUserPlan(parsed.plan || 'free');
        }

        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePurchase = async (planId) => {
        if (!userPlan) {
            router.push('/login?redirect=pricing');
            return;
        }

        if (planId === 'free') {
            router.push('/dashboard');
            return;
        }

        setLoading(true);
        try {
            const plan = PLANS[planId];
            const amount = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice * 12;

            // 1. Create Order
            const { data } = await api.post('/payment/create-order', {
                planId,
                amount,
                billingCycle
            });

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_id', // Should be in env
                amount: data.order.amount,
                currency: data.order.currency,
                name: "smol.",
                description: `Upgrade to ${plan.name} (${billingCycle})`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            // Update local user data
                            const user = JSON.parse(localStorage.getItem('user'));
                            user.plan = planId;
                            localStorage.setItem('user', JSON.stringify(user));
                            setUserPlan(planId);
                            router.push('/dashboard?success=plan_upgraded');
                        }
                    } catch (err) {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: JSON.parse(localStorage.getItem('user'))?.firstName || "",
                    email: JSON.parse(localStorage.getItem('user'))?.email || "",
                },
                theme: {
                    color: "#000000"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Purchase Error:', err);
            alert(err.response?.data?.error || 'Failed to initiate purchase');
        } finally {
            setLoading(false);
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
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 text-[10px] font-black tracking-[0.2em] text-zinc-400 mb-6 uppercase"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                        Simple Pricing
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
                    
                    {/* Billing Toggle */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4 mt-8"
                    >
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-black' : 'text-zinc-400'}`}>Monthly</span>
                        <button 
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-7 bg-zinc-100 rounded-full p-1 relative transition-colors hover:bg-zinc-200"
                        >
                            <motion.div 
                                animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                                className="w-5 h-5 bg-black rounded-full"
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-black' : 'text-zinc-400'}`}>Yearly</span>
                            <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-emerald-100">Save 20%</span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
                >
                    {['free', 'starter', 'pro', 'business'].map((planKey) => {
                        const plan = PLANS[planKey];
                        const isPro = planKey === 'pro';
                        const isCurrentPlan = userPlan === planKey;
                        const price = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice;

                        const CardComponent = (
                            <PricingCard
                                key={planKey}
                                variants={itemVariants}
                                name={plan.name}
                                price={price.toString()}
                                planId={planKey}
                                billingCycle={billingCycle}
                                description={plan.description}
                                features={plan.includedFeatures.flatMap(f => f.items).slice(0, 8)} 
                                icon={React.cloneElement(plan.icon, { className: `w-5 h-5 ${isPro ? 'text-indigo-500' : 'text-zinc-400'}` })} 
                                highlight={isPro}
                                isCurrentPlan={isCurrentPlan}
                                accentColor={plan.color}
                                onPurchase={() => handlePurchase(planKey)}
                                loading={loading}
                            />
                        );

                        if (isPro) {
                            return (
                                <div key={planKey} className="relative group">
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[34px] blur transition duration-1000 ${isCurrentPlan ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'}`}></div>
                                    {CardComponent}
                                </div>
                            );
                        }
                        return CardComponent;
                    })}
                </motion.div>
            </div>
        </section>
    );
}

function PricingCard({ name, price, planId, billingCycle, description, features, icon, highlight = false, isCurrentPlan = false, accentColor = "zinc", variants, onPurchase, loading }) {
    const isFree = price === "0";

    return (
        <motion.div
            variants={variants}
            className={`relative h-full bg-white p-8 rounded-[32px] border ${isCurrentPlan ? 'border-black ring-2 ring-black/5' : highlight ? 'border-transparent' : 'border-zinc-100 hover:border-black/10'} shadow-xl shadow-zinc-200/50 flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10`}
        >
            {isCurrentPlan && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap z-10 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" />
                    Current Plan
                </div>
            )}
            
            {!isCurrentPlan && highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-100 text-zinc-500 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap z-10">
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
                    <motion.span 
                        key={price}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tighter"
                    >
                        ₹{price}
                    </motion.span>
                    <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-zinc-500 text-[10px] font-bold mt-2 leading-relaxed uppercase tracking-widest">
                    {billingCycle === 'monthly' ? 'Billed monthly' : `Billed annually (₹${parseInt(price) * 12}/yr)`}
                </p>
                <p className="text-zinc-400 text-[10px] font-medium mt-1 leading-relaxed h-10">{description}</p>
            </div>

            <div className="space-y-4 mb-8 flex-1">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrentPlan || highlight ? 'text-indigo-500' : 'text-zinc-300'}`} />
                        <span className="text-xs font-bold text-zinc-600">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onPurchase}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center ${isCurrentPlan
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                    : highlight
                    ? 'bg-black text-white hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20'
                    : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {loading ? 'Processing...' : isCurrentPlan ? 'Go to Dashboard' : isFree ? 'Start Free' : 'Upgrade Now'}
            </button>
        </motion.div>
    );
}
