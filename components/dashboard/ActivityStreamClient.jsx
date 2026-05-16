"use client";
import React, { useState, useEffect } from 'react';
import { 
    Activity, ArrowLeft, RefreshCw, 
    Link2, MapPin, Globe, Terminal, Loader2,
    Calendar, Clock, Shield, Search, Zap
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import api from '@/lib/api';

export default function ActivityStreamClient() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/links/activity');
            setActivities(data.data);
        } catch (err) {
            console.error('Failed to sync signals:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    const filteredActivities = activities.filter(act => 
        act.shortCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.location?.country?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Sub-header */}
            <div className="pt-24 pb-12 px-8 border-b border-zinc-100 bg-zinc-50/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-8 group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Command Center
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black">
                            SIGNAL <span className="text-zinc-400">STREAM.</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-4 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           Real-time Intelligence Feed
                        </p>
                    </div>
                    
                    <button 
                        onClick={fetchActivity}
                        disabled={loading}
                        className="flex items-center gap-3 px-6 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync Signals
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* Search Bar */}
                <div className="mb-12">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Filter signals by shortcode or location..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-100 text-black text-sm font-bold rounded-2xl py-5 pl-12 pr-6 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center text-zinc-300">
                        <Loader2 className="w-10 h-10 animate-spin mb-6 text-black" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Deciphering Encrypted Stream...</p>
                    </div>
                ) : filteredActivities.length > 0 ? (
                    <div className="space-y-6">
                        {filteredActivities.map((act, i) => (
                            <div 
                                key={i} 
                                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-white border border-zinc-100 rounded-[32px] hover:border-black hover:shadow-2xl hover:shadow-zinc-200/50 transition-all"
                            >
                                <div className="flex items-center gap-6 mb-4 md:mb-0">
                                    <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-black transition-colors relative">
                                        <Zap className="w-6 h-6 text-black group-hover:text-white" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-black text-lg text-black">/{act.shortCode}</p>
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                {act.userAgent?.device || 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {act.location?.city ? `${act.location.city}, ${act.location.country}` : 'Unknown Location'}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5" />
                                                {act.referrer ? new URL(act.referrer).hostname : 'Direct Entry'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 pl-20 md:pl-0">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-1">Packet Captured</p>
                                        <div className="flex items-center justify-end gap-2 text-zinc-500 font-bold text-sm">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatDistanceToNow(new Date(act.timestamp))} ago
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-zinc-100" />
                                    <div className="p-4 bg-zinc-50 rounded-2xl group-hover:bg-zinc-100 transition-colors">
                                        <Shield className="w-5 h-5 text-zinc-300 group-hover:text-black transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center border-2 border-dashed border-zinc-100 rounded-[48px]">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Terminal className="w-10 h-10 text-zinc-200" />
                        </div>
                        <h3 className="text-xl font-black text-black mb-2">No signals detected.</h3>
                        <p className="text-zinc-400 font-medium">Try broadening your search parameters or sync manually.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
