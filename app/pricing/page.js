import React from 'react';
import Navbar from '@/components/Navbar';
import PricingSection from '@/components/PricingSection';
import { ArrowLeft, Check, Minus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Pricing & Plans',
    description: 'Compare smolSaaS plans. Start for free or scale with our Elite and Business tiers.',
};

export default function PricingPage() {
    const renderCell = (value) => {
        if (value === true) return <Check className="w-5 h-5 text-emerald-500 mx-auto" />;
        if (value === false) return <Minus className="w-5 h-5 text-zinc-300 mx-auto" />;
        return value;
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24">
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
                <PricingSection />
                
                {/* Comparison Table */}
                <section className="py-24 px-6 border-t border-zinc-100">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-black mb-12 text-center">Compare Plans</h2>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200">
                                        <th className="py-4 px-6 font-bold text-sm text-zinc-500 uppercase tracking-wider">Features</th>
                                        <th className="py-4 px-6 font-bold text-sm text-center">Spark (Free)</th>
                                        <th className="py-4 px-6 font-bold text-sm text-center text-emerald-600">Growth (₹399)</th>
                                        <th className="py-4 px-6 font-bold text-sm text-center text-indigo-600">Elite (₹899)</th>
                                        <th className="py-4 px-6 font-bold text-sm text-center text-amber-600">Scale (₹2499)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-zinc-700">
                                    {[
                                        { name: "Active Signal limit", free: "50", starter: "500", pro: "Unlimited", business: "50,000" },
                                        { name: "Monthly Intel Pings (Clicks)", free: "1K", starter: "15K", pro: "150K", business: "2M" },
                                        { name: "Data Retention", free: "7 Days", starter: "30 Days", pro: "1 Year", business: "Unlimited" },
                                        { name: "Custom Domain", free: false, starter: "1 Domain", pro: "5 Domains", business: "25 Domains" },
                                        { name: "Custom Aliases", free: true, starter: true, pro: true, business: true },
                                        { name: "QR Codes", free: true, starter: true, pro: true, business: true },
                                        { name: "Geo Intelligence", free: "Basic", starter: "Country-Level", pro: "City-Level", business: "City-Level" },
                                        { name: "Device Targeting", free: false, starter: true, pro: true, business: true },
                                        { name: "Export Data (CSV)", free: false, starter: true, pro: true, business: true },
                                        { name: "Campaign Management", free: false, starter: false, pro: true, business: true },
                                        { name: "Bot & Ghost Filtering", free: false, starter: false, pro: true, business: true },
                                        { name: "UTM Intelligence", free: false, starter: false, pro: true, business: true },
                                        { name: "Destination Heartbeat", free: false, starter: false, pro: true, business: true },
                                        { name: "Advanced Geo-Heatmaps", free: false, starter: false, pro: false, business: true },
                                        { name: "Retargeting Pixels", free: false, starter: false, pro: true, business: true },
                                        { name: "Bulk Creation", free: false, starter: false, pro: true, business: true },
                                        { name: "Account Manager", free: false, starter: false, pro: false, business: true },
                                        { name: "White-label Dashboard", free: false, starter: false, pro: false, business: true },
                                        { name: "99.99% Uptime SLA", free: false, starter: false, pro: false, business: true },
                                        { name: "SSO / SAML", free: false, starter: false, pro: false, business: true },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                            <td className="py-4 px-6 font-semibold">{row.name}</td>
                                            <td className="py-4 px-6 text-center text-zinc-500">{renderCell(row.free)}</td>
                                            <td className="py-4 px-6 text-center text-zinc-900">{renderCell(row.starter)}</td>
                                            <td className="py-4 px-6 text-center text-zinc-900 bg-indigo-50/10">{renderCell(row.pro)}</td>
                                            <td className="py-4 px-6 text-center text-zinc-900">{renderCell(row.business)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
            </div>
    );
}
