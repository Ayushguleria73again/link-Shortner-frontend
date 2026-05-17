"use client";
import React, { useState } from 'react';
import { 
    Activity, ArrowLeft, RefreshCw, 
    Link2, MapPin, Globe, Terminal, Loader2,
    Calendar, Clock, Shield, Search, Zap,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';

import { useActivityStream, useUrls } from '@/hooks/useQueries';

export default function ActivityStreamClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLink, setSelectedLink] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const { data: response = {}, isLoading: loading, refetch } = useActivityStream(selectedLink, currentPage);
    const activities = response.data || [];
    const pagination = response.pagination || { total: 0, page: 1, pages: 1 };
    
    const { data: urls = [] } = useUrls();

    const fetchActivity = () => refetch();

    // Combine all active URLs with any historical ones found in the activity feed
    const uniqueLinks = [...new Set([
        ...urls.map(u => u.shortCode),
        ...activities.map(act => act.shortCode)
    ])];

    // Client-side text search filter on the current page of results
    const filteredActivities = activities.filter(act => {
        return act.shortCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               act.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               act.country?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Reset to page 1 whenever filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedLink]);

    const totalPages = Math.max(1, pagination.pages || 1);

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
                {/* Search Bar & Filters */}
                <div className="mb-12 flex flex-col md:flex-row gap-4">
                    <div className="relative group flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Filter signals by shortcode or location..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full min-h-[56px] bg-zinc-50 border border-zinc-100 text-black text-sm font-bold rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                        />
                    </div>
                    
                    <div className="relative md:w-64">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Link2 className="w-4 h-4 text-zinc-400" />
                        </div>
                        <select
                            value={selectedLink}
                            onChange={(e) => setSelectedLink(e.target.value)}
                            className="w-full h-full min-h-[56px] appearance-none bg-zinc-50 border border-zinc-100 text-black text-sm font-bold rounded-2xl py-4 pl-12 pr-10 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all cursor-pointer"
                        >
                            <option value="ALL">All Links</option>
                            {uniqueLinks.map(link => (
                                <option key={link} value={link}>{link}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <div className="w-2 h-2 border-b-2 border-r-2 border-zinc-400 transform rotate-45 -translate-y-0.5" />
                        </div>
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
                                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-5 bg-white border border-zinc-100 rounded-[24px] hover:border-black hover:shadow-2xl hover:shadow-zinc-200/50 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                    <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-black transition-colors relative flex-shrink-0">
                                        <Zap className="w-4 h-4 text-black group-hover:text-white" />
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <Link href={`/dashboard?link=${act.shortCode}`} className="font-black text-base text-black hover:text-indigo-600 transition-colors">/{act.shortCode}</Link>
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                {act.device && act.device !== 'unknown' ? act.device : 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {(act.city && act.city !== 'Unknown') ? `${act.city}, ${act.country}` : 'Unknown Location'}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5" />
                                                {(() => {
                                                    if (!act.referrer || act.referrer === 'Direct') return 'Direct Entry';
                                                    try { return new URL(act.referrer).hostname; }
                                                    catch (e) { return act.referrer; }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 md:gap-6 pl-14 md:pl-0 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mb-0.5">Packet Captured</p>
                                        <div className="flex items-center justify-end gap-1.5 text-zinc-500 font-bold text-xs">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(act.createdAt))} ago
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-zinc-100 hidden md:block" />
                                    <div className="p-3 bg-zinc-50 rounded-xl group-hover:bg-zinc-100 transition-colors">
                                        <Shield className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-100">
                                <p className="text-xs font-bold text-zinc-400">
                                    Showing <span className="text-black">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="text-black">{Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)}</span> of <span className="text-black">{pagination.total}</span> signals
                                </p>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-3 bg-white border border-zinc-200 rounded-xl text-black hover:border-black hover:bg-zinc-50 disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:bg-white transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="px-4 py-3 bg-zinc-50 rounded-xl text-xs font-black text-black">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-3 bg-white border border-zinc-200 rounded-xl text-black hover:border-black hover:bg-zinc-50 disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:bg-white transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
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
