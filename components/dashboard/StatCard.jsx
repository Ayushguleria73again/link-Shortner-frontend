"use client";
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatCard({ label, title, value, icon, color = 'bg-indigo-500', trend }) {
    const displayLabel = label || title;
    return (
        <div className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.06] transition-opacity`} />
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color}/10 text-black`}>
                    {icon && React.cloneElement(icon, { className: 'w-5 h-5' })}
                </div>
                {trend ? (
                    <span className="text-[8px] font-black text-emerald-500 uppercase px-2 py-1 bg-emerald-50 rounded-md">{trend}</span>
                ) : (
                    <TrendingUp className="w-4 h-4 text-zinc-200 group-hover:text-black transition-colors" />
                )}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 relative z-10">{displayLabel}</p>
            <p className="text-3xl font-black tracking-tighter text-black relative z-10 font-mono italic">{value}</p>
        </div>
    );
}
