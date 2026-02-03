"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams, useRouter } from 'next/navigation';
import { Check, Shield, Zap, Activity, Globe, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRazorpay } from 'react-razorpay';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

const PLANS = {
    free: {
        name: "Spark",
        price: 0,
        description: "Perfect for testing the waters.",
        icon: <Zap className="w-8 h-8 text-zinc-400" />,
        color: "zinc",
        features: ["50 Active Links", "1,000 Monthly Clicks", "Basic Analytics"]
    },
    starter: {
        name: "Growth",
        price: 399,
        description: "Essential tools for growing creators.",
        icon: <Activity className="w-8 h-8 text-emerald-500" />,
        color: "emerald",
        features: ["500 Active Links", "15,000 Monthly Clicks", "Country & Device Data", "Custom Aliases", "CSV Export"]
    },
    pro: {
        name: "Elite",
        price: 899,
        description: "Advanced power for serious brands.",
        icon: <Shield className="w-8 h-8 text-indigo-500" />,
        color: "indigo",
        features: ["Unlimited Active Links", "150,000 Monthly Clicks", "City-Level Geo Data", "Real-time Analytics", "Developer API", "Smart Retargeting", "Priority Support"]
    },
    business: {
        name: "Scale",
        price: 2499,
        description: "Enterprise-grade infrastructure.",
        icon: <Globe className="w-8 h-8 text-amber-500" />,
        color: "amber",
        features: ["Unlimited Active Links", "2M Monthly Clicks", "White-label Dashboard", "Custom Domains", "Account Manager", "SSO"]
    }
};

export default function PlanDetailPage() {
    const { planId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { Razorpay } = useRazorpay();

    const plan = PLANS[planId];

    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Plan not found</p>
            </div>
        );
    }

    const handlePayment = async () => {
        if (!Razorpay) {
            toast.error("Payment gateway initializing...");
            return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            router.push(`/login?redirect=/pricing/${planId}`);
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order
            const { data: orderData } = await api.post('/payment/create-order', {
                planId,
                amount: plan.price
            });

            if (!orderData.success) {
                throw new Error('Order creation failed');
            }

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: "INR",
                name: "Shorty SaaS",
                description: `Upgrade to ${plan.name} Plan`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId // Send planId for legacy verification check if needed, but backend relies on stored intent
                        });

                        if (verifyRes.data.success) {
                            toast.success(`Welcome to ${plan.name}!`);
                            window.location.href = '/dashboard';
                        }
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                theme: { color: "#000000" }
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Pricing
                </Link>

                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid md:grid-cols-2">
                    {/* Left: Plan Info */}
                    <div className="p-10 md:p-14 flex flex-col justify-between">
                        <div>
                            <div className={`w-16 h-16 rounded-2xl bg-${plan.color}-50 flex items-center justify-center mb-8`}>
                                {plan.icon}
                            </div>
                            <h1 className="text-4xl font-black mb-4">{plan.name}</h1>
                            <p className="text-zinc-500 font-medium text-lg leading-relaxed mb-8">
                                {plan.description}
                            </p>
                            
                            <div className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full bg-${plan.color}-100 flex items-center justify-center`}>
                                            <Check className={`w-3 h-3 text-${plan.color}-600`} />
                                        </div>
                                        <span className="font-medium text-zinc-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Checkout Action */}
                    <div className="bg-zinc-900 text-white p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-[100px] opacity-50 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-2">Total Due Today</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-6xl font-black tracking-tighter">₹{plan.price}</span>
                                <span className="text-zinc-500 font-medium">/month</span>
                            </div>

                            <div className="bg-zinc-800/50 rounded-xl p-6 mb-8 border border-zinc-700/50">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-zinc-400">Subtotal</span>
                                    <span className="font-mono">₹{plan.price}.00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span className="text-zinc-400">Taxes</span>
                                    <span className="font-mono">₹0.00</span>
                                </div>
                                <div className="h-px bg-zinc-700 mb-4" />
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{plan.price}.00</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Proceed to Payment'}
                            </button>
                            <p className="text-center text-zinc-500 text-xs mt-4">
                                Secure payments via Razorpay. Cancel anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
