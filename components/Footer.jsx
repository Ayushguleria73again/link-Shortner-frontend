"use client";
import React from 'react';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-20 border-t border-zinc-100 bg-white">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-2 font-black tracking-tighter text-xl">
                    <Link2 className="w-6 h-6" />
                    <span className="lowercase">smol.</span>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Link href="/about" className="hover:text-black transition-colors">About</Link>
                    <Link href="/faq" className="hover:text-black transition-colors">FAQ</Link>
                    <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
                    <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
                    &copy; {new Date().getFullYear()} — Engineered for Data Obsession.
                </p>
            </div>
        </footer>
    );
}
