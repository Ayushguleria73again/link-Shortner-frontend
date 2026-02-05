"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Link2, Twitter, Github, Linkedin, Mail, ArrowRight, Zap, Shield, Globe, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Newsletter logic placeholder
        setEmail('');
    };

    return (
        <footer className="relative bg-white border-t border-zinc-100 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <Link href="/" className="flex items-center gap-2 font-black tracking-tighter text-2xl group w-fit">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                <Link2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="lowercase">smol.</span>
                        </Link>

                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-medium">
                            The internet's aesthetic link shortener. We convert long-form noise into high-signal vanity URLs, backed by deep intelligence and zero latency.
                        </p>

                        <div className="flex items-center gap-4">
                            <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
                            <SocialLink icon={<Github className="w-4 h-4" />} href="#" />
                            <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Intelligence</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/dashboard">Dashboard</FooterLink>
                            <FooterLink href="/pricing">Pricing</FooterLink>
                            <FooterLink href="/blog">Intel Feed (Blog)</FooterLink>
                            <FooterLink href="/dashboard/performers">Top Signals</FooterLink>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Operation</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                            <FooterLink href="/faq">FAQ</FooterLink>
                            <FooterLink href="/report" className="text-red-500">Report Bug</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Signal Stream</h4>
                        <p className="text-zinc-500 text-[11px] leading-snug font-medium">
                            Join 10k+ engineers receiving weekly telemetry insights.
                        </p>
                        <form onSubmit={handleSubscribe} className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Protocol"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-black transition-all"
                            />
                            <button className="absolute right-2 top-2 p-1.5 bg-black text-white rounded-lg hover:scale-110 transition-transform">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-zinc-50 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">All Systems Operational</span>
                        </div>
                        <div className="h-4 w-px bg-zinc-100 hidden md:block" />
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Legal Override</Link>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                        <span>&copy; {new Date().getFullYear()}</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-200" />
                        <span>Engineered for Data Obsession</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children, className = "" }) {
    return (
        <li>
            <Link
                href={href}
                className={`text-zinc-500 hover:text-black text-xs font-bold transition-all hover:translate-x-1 inline-block ${className}`}
            >
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ icon, href }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-black hover:border-black hover:bg-white transition-all hover:-translate-y-1"
        >
            {icon}
        </Link>
    );
}
