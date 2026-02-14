"use client";
import React from 'react';

export function UtmList({ title, data }) {
    const cleanData = (data || []).filter(d => d.name !== 'None');
    return (
        <div className="space-y-4">
            <h4 className="text-[9px] font-black text-black uppercase tracking-widest mb-4 pb-2 border-b border-zinc-50">{title}</h4>
            {cleanData.length > 0 ? cleanData.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                    <span className="text-[10px] font-bold text-zinc-600 truncate max-w-[150px] uppercase tracking-tighter">{item.name}</span>
                    <span className="text-[10px] font-black font-mono text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">{item.value}</span>
                </div>
            )) : (
                <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest italic">No {title} data captured</p>
            )}
        </div>
    );
}

export function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${active
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-black hover:bg-zinc-100/50'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
