"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24">
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
                                        { name: "Monthly Links", free: "50", starter: "500", pro: "Unlimited", business: "Unlimited" },
                                        { name: "Monthly Clicks", free: "1K", starter: "15K", pro: "150K", business: "2M" },
                                        { name: "Data Retention", free: "30 Days", starter: "90 Days", pro: "1 Year", business: "Unlimited" },
                                        { name: "Custom Aliases", free: "❌", starter: "✅", pro: "✅", business: "✅" },
                                        { name: "QR Codes", free: "✅", starter: "✅", pro: "✅", business: "✅" },
                                        { name: "Geo Analytics", free: "Basic", starter: "Country", pro: "City-Level", business: "City-Level" },
                                        { name: "Device Analytics", free: "Basic", starter: "Detailed", pro: "Detailed", business: "Detailed" },
                                        { name: "Export Data (CSV)", free: "❌", starter: "✅", pro: "✅", business: "✅" },
                                        { name: "Developer API", free: "❌", starter: "❌", pro: "✅", business: "✅" },
                                        { name: "Smart Retargeting", free: "❌", starter: "❌", pro: "✅", business: "✅" },
                                        { name: "Account Manager", free: "❌", starter: "❌", pro: "❌", business: "✅" },
                                        { name: "SSO", free: "❌", starter: "❌", pro: "❌", business: "✅" },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                            <td className="py-4 px-6 font-semibold">{row.name}</td>
                                            <td className="py-4 px-6 text-center text-zinc-500">{row.free}</td>
                                            <td className="py-4 px-6 text-center text-zinc-900">{row.starter}</td>
                                            <td className="py-4 px-6 text-center text-zinc-900 bg-indigo-50/10">{row.pro}</td>
                                            <td className="py-4 px-6 text-center text-zinc-900">{row.business}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
