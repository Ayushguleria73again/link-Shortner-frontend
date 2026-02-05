"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
    ArrowLeft, Trophy, TrendingUp, Target, Zap, 
    Loader2, Search, ExternalLink, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function PerformersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [urls, setUrls] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPerformers();
    }, []);

    const fetchPerformers = async () => {
        try {
            const res = await api.get('/url?sort=clicks');
            if (res.data.success) {
                setUrls(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUrls = urls.filter(u => 
        u.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <button 
                            onClick={() => router.back()} 
                            className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-sm font-bold mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Command Center
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
                                <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                             </div>
                             <h1 className="text-4xl font-black text-black tracking-tight">Top Signals.</h1>
                        </div>
                        <p className="text-zinc-500 font-medium text-lg max-w-xl">
                            Live telemetry and performance rankings for your active protocols.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search signals..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-zinc-200 text-black text-sm font-bold rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-zinc-300"
                        />
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden relative">
                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center text-zinc-400">
                             <Loader2 className="w-8 h-8 animate-spin mb-4 text-black" />
                             <p className="text-xs font-black uppercase tracking-widest">Loading Rankings...</p>
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
                                                    <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                        <Zap className="w-4 h-4 text-indigo-500" />
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
                            <h3 className="text-lg font-black text-black mb-2">No signals found.</h3>
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
