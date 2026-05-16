"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Database, Settings, Globe, RefreshCcw } from 'lucide-react';
import { TabButton } from './DashboardTabs';

const DashboardHeader = ({
    userPlan,
    activeView,
    setActiveView,
    setSelectedShortCode,
    fetchOverview,
    fetchUrls,
    loading
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
                <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black mb-6 transition-colors group w-fit">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Homepage</span>
                </Link>
                <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${userPlan === 'starter' ? 'bg-emerald-50' :
                            userPlan === 'pro' ? 'bg-indigo-50' :
                                userPlan === 'business' ? 'bg-amber-50' :
                                    'bg-zinc-100'
                        }`}>
                        <Zap className={`w-5 h-5 ${userPlan === 'starter' ? 'text-emerald-600 fill-emerald-600' :
                                userPlan === 'pro' ? 'text-indigo-600 fill-indigo-600' :
                                    userPlan === 'business' ? 'text-amber-600 fill-amber-600' :
                                        'text-zinc-400 fill-zinc-400'
                            }`} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${userPlan === 'starter' ? 'text-emerald-500' :
                            userPlan === 'pro' ? 'text-indigo-500' :
                                userPlan === 'business' ? 'text-amber-500' :
                                    'text-zinc-400'
                        }`}>
                        {userPlan === 'starter' ? 'Growth' : userPlan === 'pro' ? 'Advanced' : userPlan === 'business' ? 'Enterprise' : 'Basic'}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Your Dashboard.</h1>
                <p className="text-zinc-400 font-medium text-sm mt-2 max-w-md">Manage your links and view audience insights in one place.</p>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                    <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-2xl border border-zinc-100">
                        <TabButton
                            active={activeView === 'links'}
                            onClick={() => { setActiveView('links'); setSelectedShortCode(null); }}
                            icon={<Database className="w-3.5 h-3.5" />}
                            label="Inventory"
                        />
                        <TabButton
                            active={activeView === 'overview'}
                            onClick={() => { setActiveView('overview'); fetchOverview(); setSelectedShortCode(null); }}
                            icon={<Zap className={`w-3.5 h-3.5 ${activeView === 'overview' ? 'text-indigo-500' : ''}`} />}
                            label="Advanced Analytics"
                        />
                        <TabButton
                            active={activeView === 'hub'}
                            onClick={() => { setActiveView('hub'); setSelectedShortCode(null); }}
                            icon={<Globe className={`w-3.5 h-3.5 ${activeView === 'hub' ? 'text-indigo-500' : ''}`} />}
                            label="Link Hub"
                        />
                        <TabButton
                            active={activeView === 'settings'}
                            onClick={() => { setActiveView('settings'); setSelectedShortCode(null); }}
                            icon={<Settings className="w-3.5 h-3.5" />}
                            label="Account Settings"
                        />
                    </div>
                </div>
            </div>

            {activeView === 'links' && (
                <button
                    onClick={fetchUrls}
                    className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 px-6 py-3 rounded-2xl transition-all border border-zinc-100 font-bold text-xs uppercase tracking-widest text-zinc-600 group"
                >
                    <RefreshCcw className={`w-4 h-4 text-zinc-400 group-hover:text-black transition-colors ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            )}
        </div>
    );
};

export default DashboardHeader;
