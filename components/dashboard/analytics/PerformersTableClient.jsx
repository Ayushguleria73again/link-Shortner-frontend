"use client";
import React, { useState } from 'react';
import { 
    Trophy, ArrowLeft, RefreshCw, 
    Zap, ExternalLink, Calendar, 
    Search, Target, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

import { useTopPerformers } from '@/hooks/useQueries';

export default function PerformersTableClient() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: urls = [], isLoading: loading, refetch } = useTopPerformers();

    const fetchPerformers = () => refetch();

    const filteredUrls = urls.filter(url => 
        url.shortCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.originalUrl?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-12 px-8 border-b border-zinc-100 bg-zinc-50/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-8 group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Command Center
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black">
                            ELITE <span className="text-zinc-400">SIGNALS.</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-4 flex items-center gap-2">
                           <Trophy className="w-3 h-3 text-yellow-500" />
                           Top Performing Intelligence Nodes
                        </p>
                    </div>
                    
                    <button 
                        onClick={fetchPerformers}
                        disabled={loading}
                        className="flex items-center gap-3 px-6 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync Data
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-12">
                <div className="mb-12">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search signals..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-100 text-black text-sm font-bold rounded-2xl py-5 pl-12 pr-6 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden relative">
                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center text-zinc-300">
                             <Loader2 className="w-10 h-10 animate-spin mb-6 text-black" />
                             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Ranking Intelligence Nodes...</p>
                        </div>
                    ) : filteredUrls.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Rank</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Signal / Alias</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Protocol</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Total Hits</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Unique Reach</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filteredUrls.map((url, index) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={url._id} 
                                            className="group hover:bg-zinc-50/80 transition-colors"
                                        >
                                            <td className="px-10 py-6">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black font-mono ${
                                                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-zinc-200 text-zinc-700' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-zinc-50 text-zinc-400'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                                                        <Zap className="w-4 h-4 text-indigo-500 group-hover:text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-black group-hover:text-indigo-600 transition-colors">/{url.shortCode}</p>
                                                        {url.customDomain && <p className="text-[9px] font-bold text-zinc-400">{url.customDomain}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2 max-w-[240px]">
                                                    <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="truncate text-xs font-bold text-zinc-500 hover:text-black hover:underline transition-colors block">
                                                        {url.originalUrl}
                                                    </a>
                                                    <ExternalLink className="w-3 h-3 text-zinc-300 shrink-0" />
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className="font-black text-black font-mono text-lg">{url.totalClicks?.toLocaleString()}</span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className="font-bold text-zinc-500 font-mono">{url.uniqueClicks?.toLocaleString()}</span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 text-zinc-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[10px] uppercase font-bold tracking-wider">{formatDistanceToNow(new Date(url.createdAt))} ago</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-black text-black mb-2">No signals found.</h3>
                            <p className="text-zinc-400 text-sm max-w-sm">
                                Use the search bar to find specific protocols or create new ones to start tracking.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
