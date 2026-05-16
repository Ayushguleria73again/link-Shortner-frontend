"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

const PLANS = {
    'spark': {
        id: 'spark',
        name: 'Spark',
        price: 0,
        color: 'zinc',
        icon: <div className="w-8 h-8 bg-zinc-100 rounded-lg" />,
        idealFor: 'Personal Projects',
        longDescription: 'Perfect for individuals and experimenters who need basic link management with premium aesthetics.',
        includedFeatures: [
            { category: 'Management', items: ['5 Active Links', '1,000 Monthly Hits', 'Burn-on-Read Feature'] },
            { category: 'Intelligence', items: ['Basic Click Tracking', 'Referrer Data'] }
        ]
    },
    'growth': {
        id: 'growth',
        name: 'Growth',
        price: 499,
        color: 'emerald',
        icon: <div className="w-8 h-8 bg-emerald-100 rounded-lg" />,
        idealFor: 'Emerging Brands',
        longDescription: 'Scale your presence with custom branding and deeper intelligence insights.',
        includedFeatures: [
            { category: 'Management', items: ['50 Active Links', '10,000 Monthly Hits', '1 Custom Domain'] },
            { category: 'Intelligence', items: ['Location Analytics', 'Device Tracking', 'QR Code Identities'] }
        ]
    },
    'elite': {
        id: 'elite',
        name: 'Elite',
        price: 1499,
        color: 'indigo',
        icon: <div className="w-8 h-8 bg-indigo-100 rounded-lg" />,
        idealFor: 'Power Users',
        longDescription: 'Our most popular tier. Full access to the smol intelligence engine and professional tools.',
        includedFeatures: [
            { category: 'Management', items: ['Unlimited Links', '100,000 Monthly Hits', '5 Custom Domains', 'Password Protection'] },
            { category: 'Intelligence', items: ['Advanced API Access', 'Deep Device Intel', 'Priority Nodes'] }
        ]
    },
    'scale': {
        id: 'scale',
        name: 'Scale',
        price: 4999,
        color: 'rose',
        icon: <div className="w-8 h-8 bg-rose-100 rounded-lg" />,
        idealFor: 'Enterprise Teams',
        longDescription: 'Maximum performance and dedicated support for large-scale operations and high-volume traffic.',
        includedFeatures: [
            { category: 'Management', items: ['Custom Link Capacity', 'Unlimited Domains', 'Team Management', 'SSO Support'] },
            { category: 'Intelligence', items: ['Real-time Webhooks', 'Raw Data Export', 'Dedicated Account Manager'] }
        ]
    }
};

export default function PricingCheckoutClient({ planId }) {
    const plan = PLANS[planId?.toLowerCase()];
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async () => {
        if (!plan) return;
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication required to proceed.');
            window.location.href = `/login?redirect=/pricing/${planId}`;
            return;
        }

        setLoading(true);
        try {
            const { data: orderData } = await api.post('/payment/create-order', {
                planId,
                amount: plan.price
            });

            if (!orderData.success) {
                throw new Error('Order creation failed');
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: "INR",
                name: "smol SaaS",
                description: `Upgrade to ${plan.name} Plan`,
                order_id: orderData.order.id,
                prefill: {
                    name: user ? `${user.firstName} ${user.lastName}` : undefined,
                    email: user ? user.email : undefined,
                    contact: user ? user.phoneNumber : undefined
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId 
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

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    if (!plan) return <div className="min-h-screen flex items-center justify-center font-black">Plan Not Found.</div>;

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Pricing
                </Link>

                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid md:grid-cols-2">
                    {/* Left: Plan Info */}
                    <div className="p-10 md:p-14 flex flex-col justify-between bg-white relative">
                        <div>
                            <div className="mb-8">
                                {plan.icon}
                            </div>
                            <div className="mb-6">
                                <h1 className="text-4xl font-black mb-2">{plan.name}</h1>
                                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">{plan.idealFor}</p>
                            </div>
                            
                            <p className="text-zinc-500 font-medium text-lg leading-relaxed mb-10">
                                {plan.longDescription}
                            </p>
                            
                            <div className="space-y-6">
                                {plan.includedFeatures.map((group, i) => (
                                    <div key={i}>
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">{group.category}</h4>
                                        <div className="space-y-3">
                                            {group.items.map((item, j) => (
                                                <div key={j} className="flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-zinc-50 flex items-center justify-center shrink-0">
                                                        <Check className="w-3 h-3 text-zinc-600" />
                                                    </div>
                                                    <span className="font-medium text-zinc-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Checkout Action */}
                    <div className="bg-zinc-900 text-white p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
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
                                    <span className="font-mono">₹{Math.round(plan.price / 1.18)}.00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span className="text-zinc-400">GST (18%)</span>
                                    <span className="font-mono">₹{plan.price - Math.round(plan.price / 1.18)}.00</span>
                                </div>
                                <div className="h-px bg-zinc-700 mb-4" />
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{plan.price}.00</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-2 text-right">Inclusive of GST</p>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
            
        </div>
    );
}
