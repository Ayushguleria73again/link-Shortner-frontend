"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
    ChevronLeft, ChevronRight, Loader2, Globe, Laptop, 
    Smartphone, Search, Filter, Shield,
    Activity, ArrowLeftRight, Clock, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import SignalReport from '@/components/SignalReport';

export default function ActivityArchive() {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedSignal, setSelectedSignal] = useState(null);
    const [userPlan, setUserPlan] = useState('free');

    useEffect(() => {
        fetchActivity();
        fetchUserPlan();
    }, [page, filter]);

    const fetchUserPlan = async () => {
        try {
            const { data } = await api.get('/auth/me');
            if (data.data) {
                setUserPlan(data.data.plan || 'free');
            }
        } catch (err) {
            console.error('Error fetching plan:', err);
        }
    };

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/analytics/activity?page=${page}&limit=50`);
            setActivity(data.data);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredActivity = activity.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'human') return !a.isBot;
        if (filter === 'bot') return a.isBot;
        return true;
    });

    return (
        <div className="min-h-screen bg-white p-8 md:p-12 lg:p-20">
            {/* Header Handshake */}
            <div className="max-w-7xl mx-auto mb-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/dashboard"
                            className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Signal Registry.</h1>
                            <p className="text-zinc-400 font-medium text-sm mt-2 max-w-md uppercase tracking-widest text-[10px] font-black">Historical access to global redirection metrics</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
                        {['all', 'human', 'bot'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filter === f ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-black'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix Data Stream */}
            <div className="max-w-7xl mx-auto">
                {loading && page === 1 ? (
                    <div className="py-40 flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Decrypting Signal Stream...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredActivity.map((signal, i) => (
                            <div 
                                key={signal._id} 
                                onClick={() => setSelectedSignal(signal)}
                                className="group bg-zinc-50/50 hover:bg-white border border-zinc-100 p-6 rounded-[28px] transition-all hover:shadow-xl hover:shadow-zinc-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${signal.isBot ? 'bg-zinc-100 group-hover:bg-zinc-200' : 'bg-indigo-50 group-hover:bg-indigo-100'} transition-colors`}>
                                        {signal.isBot ? <Shield className="w-6 h-6 text-zinc-400" /> : <Activity className="w-6 h-6 text-indigo-500 animate-pulse" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black text-black">/{signal.shortCode}</span>
                                            <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black rounded uppercase tracking-widest">
                                                {signal.protocol?.includes('HTTPS') || signal.protocol?.includes('443') ? 'SECURE' : 'PROTOCOL'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3 h-3 text-rose-500" />
                                                {signal.city}, {signal.country}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-amber-500" />
                                                {formatDistanceToNow(new Date(signal.createdAt))} ago
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Fingerprint</span>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800">
                                                {signal.device === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                                                {signal.browser}
                                            </div>
                                            <div className="h-4 w-px bg-zinc-200" />
                                            <span className="text-xs font-mono font-black text-zinc-400">
                                                {signal.ip ? signal.ip.split('.').slice(0, 2).join('.') + '.x.x' : 'Masked'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredActivity.length === 0 && (
                            <div className="py-20 text-center border border-dashed border-zinc-200 rounded-[40px] bg-zinc-50/50">
                                <Search className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-black uppercase tracking-tighter">No signals found</h3>
                                <p className="text-xs font-medium text-zinc-400">Try adjusting your filtration parameters</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination Sync */}
                {pagination && pagination.pages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="bg-zinc-50 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 transition-all border border-zinc-100"
                        >
                            Previous Archive
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Registry {page} of {pagination.pages}</span>
                        <button 
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-30 transition-all shadow-xl shadow-black/10"
                        >
                            Next Loadout
                        </button>
                    </div>
                )}
            </div>

            {/* Technical Footer */}
            <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-black rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">Operational Integrity Active</span>
                </div>
                <div className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                    Satellite G-14 // End-to-End Analytics Sync
                </div>
            </div>

            <SignalReport 
                click={selectedSignal} 
                userPlan={userPlan}
                onClose={() => setSelectedSignal(null)} 
            />
        </div>
    );
}
