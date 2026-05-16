"use client";
import React from 'react';
import { 
    ChevronLeft, ChevronRight, Download, Activity, 
    MousePointer2, Users, Globe, Clock, Radio, 
    Lock, MapPin, Smartphone, Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';

const LinkDetailsView = ({
    selectedShortCode,
    setSelectedShortCode,
    analytics,
    analyticsLoading,
    handleExport,
    userPlan
}) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-100">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setSelectedShortCode(null)}
                        className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all group shadow-lg shadow-black/10"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to List</span>
                    </button>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <span className="text-indigo-500">{selectedShortCode}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black bg-rose-500 text-white animate-pulse uppercase tracking-[0.2em]">Live</span>
                            Insights
                        </h2>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                Real-time traffic stream active
                            </div>
                            {analytics?.health && (
                                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${analytics.health.status === 'online' ? 'text-emerald-500' :
                                        analytics.health.status === 'offline' ? 'text-rose-500' : 'text-amber-500'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${analytics.health.status === 'online' ? 'bg-emerald-500' :
                                            analytics.health.status === 'offline' ? 'bg-rose-500' : 'bg-amber-500'
                                        }`} />
                                    Health: {analytics.health.status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => handleExport(selectedShortCode)}
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border border-emerald-100 font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all"
                >
                    <Download className="w-4 h-4" />
                    Export Data
                </button>
            </div>

            {analyticsLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Processing metrics...</p>
                </div>
            ) : analytics && (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                    {/* Stats Grid */}
                    <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Hits"
                            value={analytics.totalClicks}
                            icon={<MousePointer2 className="w-5 h-5" />}
                            color="bg-indigo-500"
                        />
                        <StatCard
                            label="Unique Reach"
                            value={analytics.uniqueClicks}
                            icon={<Users className="w-5 h-5" />}
                            color="bg-emerald-500"
                        />
                        <StatCard
                            label="Geo Markets"
                            value={analytics.countryStats?.length || 0}
                            icon={<Globe className="w-5 h-5" />}
                            color="bg-amber-500"
                        />
                        <StatCard
                            label="Peak Window"
                            value={analytics.hourlyEngagement ? [...analytics.hourlyEngagement].sort((a, b) => b.value - a.value)[0]?.name : 'N/A'}
                            icon={<Clock className="w-5 h-5" />}
                            color="bg-rose-500"
                        />
                    </div>

                    {/* Real-time Click stream */}
                    <div className="md:col-span-6 bg-zinc-50/50 border border-zinc-100 rounded-[32px] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Live Activity Stream</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard/activity"
                                    className="text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-indigo-500 transition-colors flex items-center gap-1.5"
                                >
                                    See All Activity
                                    <ChevronRight className="w-3 h-3" />
                                </Link>
                                <span className="text-[9px] font-black text-rose-500 uppercase px-2 py-1 bg-rose-50 rounded-md">Real-time</span>
                            </div>
                        </div>

                        {/* Human vs Bot breakdown (Elite+) */}
                        <div className="flex items-center gap-6 mb-8 p-4 bg-white border border-zinc-100 rounded-2xl w-fit">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Human: <span className="text-black">{analytics.humanClicks}</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bot: <span className="text-black">{analytics.botClicks}</span></span>
                            </div>
                            <div className="h-4 w-px bg-zinc-100" />
                            <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-indigo-500" style={{ width: `${(analytics.humanClicks / (analytics.totalClicks || 1)) * 100}%` }} />
                                    <div className="h-full bg-zinc-300" style={{ width: `${(analytics.botClicks / (analytics.totalClicks || 1)) * 100}%` }} />
                                </div>
                                <span className="text-[9px] font-black text-indigo-500">{Math.round((analytics.humanClicks / (analytics.totalClicks || 1)) * 100)}% Human</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {analytics.recentClicks.length > 0 ? analytics.recentClicks.slice(0, 10).map((click, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-black uppercase text-zinc-400">{formatDistanceToNow(new Date(click.createdAt))} ago</span>
                                    </div>
                                    {['free', 'starter'].includes(userPlan) ? (
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-black">{click.country || 'Unknown'}</p>
                                            <div className="flex items-center gap-1.5 opacity-50">
                                                <Lock className="w-3 h-3 text-zinc-400" />
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">City Hidden</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-xs font-black text-black mb-1 leading-tight">{click.city}, {click.country}</p>
                                            <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest leading-none mb-2">{click.browser} on {click.os}</p>

                                            {click.latitude && (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md w-fit">
                                                    <MapPin className="w-2 h-2 text-emerald-500" />
                                                    <span className="text-[7px] font-black text-emerald-600 uppercase">Tracked</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Awaiting first signal...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkDetailsView;
