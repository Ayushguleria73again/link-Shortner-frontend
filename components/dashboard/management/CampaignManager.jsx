"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    FolderPlus, Folder, Trash2, Edit3,
    BarChart3, MousePointer2, Users,
    ChevronRight, Loader2, Plus, X, Globe,
    Zap, Radio, Target
} from 'lucide-react';
import { toast } from 'sonner';

import { useCampaigns, useCreateCampaign, useDeleteCampaign } from '@/hooks/useQueries';

const CampaignManager = ({ urls, onCampaignSelect }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ name: '', description: '', color: '#6366f1' });

    // Use Centralized Hooks
    const { isLoading: loading, data: campaigns = [] } = useCampaigns();
    const { mutate: createCampaign, isPending: submitting } = useCreateCampaign();
    const { mutate: deleteCampaign } = useDeleteCampaign();

    const handleCreate = (e) => {
        e.preventDefault();
        createCampaign(newCampaign, {
            onSuccess: () => {
                setShowAddModal(false);
                setNewCampaign({ name: '', description: '', color: '#6366f1' });
            }
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this campaign? Links will be moved to ungrouped.')) return;
        deleteCampaign(id);
    };

    const getCampaignStats = (campaignId) => {
        const campaignUrls = urls.filter(u => u.campaignId === campaignId);
        return {
            linkCount: campaignUrls.length,
            totalHits: campaignUrls.reduce((sum, u) => sum + (u.totalClicks || 0), 0),
            uniqueReach: campaignUrls.reduce((sum, u) => sum + (u.uniqueClicks || 0), 0)
        };
    };

    if (loading) return (
        <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500/20" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Control Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-black rounded-r-full" />
                    <h3 className="text-3xl font-black text-black tracking-tighter">Campaigns.</h3>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <Radio className="w-3 h-3 text-indigo-500 animate-pulse" />
                        Organize and group your links
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-[16px] font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 hover:-translate-y-1 active:translate-y-0 transition-all shadow-xl shadow-black/20"
                >
                    <Plus className="w-5 h-5" />
                    Create Campaign
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="relative overflow-hidden border border-zinc-100 rounded-[24px] p-12 text-center bg-zinc-50/30 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-transparent to-rose-50/0 group-hover:via-indigo-50/30 transition-all duration-1000" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center shadow-lg mb-6 mx-auto border border-zinc-100 group-hover:scale-110 transition-transform">
                            <Target className="w-10 h-10 text-zinc-200" />
                        </div>
                        <h4 className="text-2xl font-black text-black mb-2 italic tracking-tight">No Campaigns Found.</h4>
                        <p className="text-zinc-400 text-sm font-medium mb-8 max-w-sm mx-auto">Group your links into campaigns for better organization and focused insights.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-4 transition-all"
                        >
                            Create Your First Campaign <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {campaigns.map((campaign) => {
                        const stats = getCampaignStats(campaign._id);
                        return (
                            <div key={campaign._id} className="relative bg-white border border-zinc-100 p-6 rounded-[24px] shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all group overflow-hidden">
                                {/* Technical Corner Badge */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 rotate-45 flex items-end justify-center pb-2 opacity-10 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: campaign.color }}>
                                    <Zap className="w-4 h-4 text-white -rotate-45" />
                                </div>

                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[20px] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: campaign.color }}>
                                            <Folder className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-2xl text-black tracking-tighter">{campaign.name}</h4>
                                                <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded text-[8px] font-black uppercase tracking-widest text-zinc-400">Campaign</span>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">{stats.linkCount} Managed Links</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(campaign._id)}
                                        className="p-3 text-zinc-100 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 group-hover:bg-white border border-transparent group-hover:border-zinc-100 p-4 rounded-[20px] transition-all">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Total Clicks</span>
                                        </div>
                                        <p className="text-2xl font-black text-black font-mono italic">{stats.totalHits}</p>
                                    </div>
                                    <div className="bg-zinc-50 group-hover:bg-white border border-transparent group-hover:border-zinc-100 p-4 rounded-[20px] transition-all">
                                        <div className="flex items-center gap-3 text-zinc-400 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Unique Audience</span>
                                        </div>
                                        <p className="text-2xl font-black text-black font-mono italic">{stats.uniqueReach}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-zinc-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-100" />
                                            ))}
                                        </div>
                                        <span className="text-[8px] font-black uppercase text-zinc-400">Live Traffic Monitoring</span>
                                    </div>
                                    <button
                                        onClick={() => onCampaignSelect?.(campaign._id)}
                                        className="text-[9px] font-black uppercase text-black hover:underline tracking-widest"
                                    >
                                        View Campaign Links
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* INITIALIZE MODAL [ELITE] */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[32px] p-8 max-w-xl w-full shadow-[0_0_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500 border border-zinc-100">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-4xl font-black text-black tracking-tighter mb-2">Create Campaign.</h3>
                                <p className="text-zinc-400 text-xs font-medium">Set up a new campaign to organize and track your links.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center hover:rotate-90 transition-all hover:bg-zinc-100">
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-2 block">Campaign Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-[20px] font-black text-base focus:ring-4 focus:ring-black/5 focus:bg-white outline-none transition-all placeholder:text-zinc-200"
                                    placeholder="e.g. Summer Marketing 2024"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-2 block">Campaign Theme</label>
                                <div className="flex flex-wrap gap-5 px-2">
                                    {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9', '#000000'].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewCampaign({ ...newCampaign, color })}
                                            className={`w-12 h-12 rounded-2xl transition-all relative ${newCampaign.color === color ? 'scale-110' : 'hover:scale-105 opacity-40 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {newCampaign.color === color && (
                                                <div className="absolute inset-0 border-4 border-white opacity-40 rounded-2xl" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-black text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:shadow-black/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                                Save Campaign
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignManager;
