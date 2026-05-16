"use client";
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export function FeatureCard({ icon, title, text }) {
    return (
        <div className="bg-zinc-50/50 p-12 rounded-[40px] border border-zinc-100 hover:border-zinc-200 transition-all group">
            <div className="mb-8 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-black tracking-tight mb-4 uppercase">{title}</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">{text}</p>
        </div>
    );
}

export function UseCaseCard({ category, title, description, color = "indigo" }) {
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600 hover:shadow-indigo-500/10 group-hover:bg-indigo-500",
        emerald: "bg-emerald-50 text-emerald-600 hover:shadow-emerald-500/10 group-hover:bg-emerald-500",
        rose: "bg-rose-50 text-rose-600 hover:shadow-rose-500/10 group-hover:bg-rose-500"
    };

    return (
        <div className={`bg-white p-8 rounded-[32px] border border-zinc-100 transition-all group hover:-translate-y-1 hover:shadow-xl`}>
            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 transition-colors ${colorClasses[color] || colorClasses.indigo} group-hover:text-white`}>
                {category}
            </div>
            <h3 className="text-xl font-black mb-3">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">{description}</p>
        </div>
    );
}

export function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className={`bg-zinc-50 border border-zinc-100 rounded-2xl p-6 cursor-pointer hover:bg-white hover:shadow-md transition-all group ${isOpen ? 'bg-white shadow-md border-indigo-100' : ''}`}
        >
            <div className="flex items-center justify-between">
                <h4 className={`font-bold text-sm transition-colors ${isOpen ? 'text-indigo-600' : 'text-zinc-900 group-hover:text-black'}`}>{question}</h4>
                <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-90 text-indigo-500' : 'group-hover:text-black'}`} />
            </div>
            <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
}
