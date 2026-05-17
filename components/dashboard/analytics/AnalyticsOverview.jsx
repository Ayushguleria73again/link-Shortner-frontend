"use client";
import React, { useState } from 'react';
import { 
    Zap, Users, Activity, Database, Link2, Globe, 
    Loader2, ArrowUpRight, MapPin, Smartphone, 
    ChevronRight, Search 
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import StatCard from './StatCard';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import { useActivityStream } from '@/hooks/useQueries';

const AnalyticsOverview = ({ 
    overviewData, 
    urls = [],
    userPlan, 
    showAllMarkets, 
    setShowAllMarkets, 
    loading, 
    setActiveView 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLink, setSelectedLink] = useState('ALL');

    // Fetch live feed data dynamically using the server-side filter
    const { data: activityResponse = {} } = useActivityStream(selectedLink, 1);
    const liveFeed = activityResponse.data || overviewData?.recentClicks || [];

    // Combine all active URLs with any historical ones found in the feed
    const uniqueLinks = [...new Set([
        ...urls.map(u => u.shortCode),
        ...liveFeed.map(act => act.shortCode)
    ])];

    const filteredClicks = liveFeed.filter(click => {
        return click.shortCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               click.country?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 ${['free', 'starter'].includes(userPlan) ? 'blur-[8px] pointer-events-none select-none grayscale opacity-40' : ''}`}>
            {/* OVERVIEW STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Traffic Reach"
                    value={overviewData?.totalClicks || 0}
                    icon={<Zap className="w-5 h-5 text-indigo-500" />}
                    trend="+14% this week"
                />
                <StatCard
                    title="Unique Audience"
                    value={overviewData?.uniqueClicks || 0}
                    icon={<Users className="w-5 h-5 text-emerald-500" />}
                    trend="+8% this week"
                />
                <StatCard
                    title="Human Visitors"
                    value={overviewData?.humanClicks || 0}
                    icon={<Activity className="w-5 h-5 text-indigo-500" />}
                    trend={`${Math.round((overviewData?.humanClicks / (overviewData?.totalClicks || 1)) * 100)}% ratio`}
                />
                <StatCard
                    title="Automated Traffic"
                    value={overviewData?.botClicks || 0}
                    icon={<Database className="w-5 h-5 text-zinc-400" />}
                    trend="Filtered traffic"
                />
                <StatCard
                    title="Active Redirects"
                    value={overviewData?.totalLinks || 0}
                    icon={<Link2 className="w-5 h-5 text-amber-500" />}
                />
                <StatCard
                    title="Global Markets"
                    value={overviewData?.countryStats?.length || 0}
                    icon={<Globe className="w-5 h-5 text-rose-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black text-black">Global Performance.</h3>
                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">Real-time aggregate performance metrics</p>
                            </div>
                        </div>
                        {overviewData ? (
                            <AnalyticsChart data={overviewData.dailyClicks} />
                        ) : (
                            <div className="h-[300px] flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-950 text-white rounded-[24px] p-6 relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-white">Top 5 Performers.</h3>
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {overviewData?.topPerformers?.map((u, i) => (
                                <div key={i} className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black font-mono text-zinc-600 group-hover/item:text-indigo-400 transition-colors">0{i + 1}</span>
                                        <div>
                                            <p className="text-sm font-black text-white group-hover/item:text-indigo-400 transition-colors uppercase tracking-tight">{u.shortCode}</p>
                                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest truncate max-w-[120px]">{(u.originalUrl || '').replace(/^https?:\/\//, '')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white font-mono">{u.hits}</p>
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Hits</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/dashboard/performers"
                            className="w-full py-3 bg-white text-black rounded-2xl font-black text-center text-[10px] uppercase tracking-widest mt-6 hover:bg-zinc-200 transition-all"
                        >
                            Full Performers List
                        </Link>
                    </div>
                </div>
            </div>

            {/* REAL-TIME GLOBAL FEED */}
            <div className="bg-white border border-zinc-100 rounded-[24px] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black text-black">Live Visitor Feed.</h3>
                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">Real-time engagement across your links</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Monitoring</span>
                    </div>
                </div>

                {/* Search Bar & Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative group flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Filter live feed by shortcode or location..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full min-h-[48px] bg-zinc-50 border border-zinc-100 text-black text-sm font-bold rounded-2xl py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                        />
                    </div>
                    
                    <div className="relative md:w-48">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Link2 className="w-4 h-4 text-zinc-400" />
                        </div>
                        <select
                            value={selectedLink}
                            onChange={(e) => setSelectedLink(e.target.value)}
                            className="w-full h-full min-h-[48px] appearance-none bg-zinc-50 border border-zinc-100 text-black text-sm font-bold rounded-2xl py-3 pl-12 pr-10 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all cursor-pointer"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClicks.slice(0, 9).map((click, i) => (
                        <div key={i} className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 group hover:border-black transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center font-mono text-[10px] font-black text-zinc-400">
                                        {(click.shortCode || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-black uppercase">{click.shortCode}</h4>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{format(new Date(click.createdAt), 'HH:mm:ss')}</p>
                                    </div>
                                </div>
                                <span className="text-[8px] font-black text-zinc-400 px-2 py-1 bg-white border border-zinc-100 rounded-md">
                                    {click.country || 'Global'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
                                <div className="flex items-center gap-1.5 grayscale opacity-50">
                                    <img src={`https://cdn-icons-png.flaticon.com/512/0/191.png`} className="w-3 h-3" alt="browser" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">{click.browser || 'Web'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 grayscale opacity-50 ml-auto">
                                    <Smartphone className="w-3 h-3" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">{click.device || 'Mobile'}</span>
                                </div>
                            </div>

                            {click.latitude && (
                                <div className="mt-3 flex items-center gap-2 px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-md w-fit">
                                    <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                                    <span className="text-[8px] font-black text-indigo-600 uppercase tracking-tighter">
                                        COORDS: {click.latitude.toFixed(3)}, {click.longitude.toFixed(3)}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Advanced Geo-Intelligence Heatmap (Scale Exclusive) */}
                {userPlan === 'business' && (
                    <div className="mt-8 pt-8 border-t border-zinc-50">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black text-black">Global Traffic Heatmap.</h3>
                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">Real-time signal density and market reach</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {overviewData?.countryStats?.length > 12 && (
                                    <button
                                        onClick={() => setShowAllMarkets(!showAllMarkets)}
                                        className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"
                                    >
                                        {showAllMarkets ? 'Collapse View' : `Show All ${overviewData.countryStats.length} Markets`}
                                    </button>
                                )}
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Enterprise Access Active</span>
                                </div>
                            </div>
                        </div>

                        <div className={`${showAllMarkets ? 'h-auto min-h-[400px]' : 'h-[400px]'} bg-zinc-50 rounded-[32px] border border-zinc-100 p-8 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500`}>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.06] transition-opacity">
                                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="world map" />
                            </div>

                            <div className={`relative z-10 w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ${showAllMarkets ? 'py-10' : ''}`}>
                                {overviewData?.countryStats?.slice(0, showAllMarkets ? undefined : 12).map((market, i) => (
                                    <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className={`w-3 h-3 rounded-full mb-3 ${i === 0 ? 'bg-indigo-500 animate-ping' : i < 3 ? 'bg-indigo-500' : 'bg-zinc-200'}`} />
                                        <h4 className="text-[10px] font-black text-black uppercase tracking-tighter mb-1 truncate w-full">{market.name}</h4>
                                        <p className="text-lg font-black text-black font-mono">{market.value}</p>
                                        <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Signal Hits</span>
                                    </div>
                                ))}
                                {(!overviewData?.countryStats || overviewData.countryStats.length === 0) && (
                                    <div className="col-span-full py-20 text-center text-zinc-300 font-black text-[10px] uppercase tracking-widest">
                                        Waiting for global traffic data...
                                    </div>
                                )}
                            </div>

                            {!showAllMarkets && (
                                <div className="absolute bottom-8 right-8 flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">High Saturation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-zinc-200" />
                                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Emerging Markets</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsOverview;
