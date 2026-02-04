"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    FolderPlus, Folder, Trash2, Edit3,
    BarChart3, MousePointer2, Users,
    ChevronRight, Loader2, Plus, X
} from 'lucide-react';
import { toast } from 'sonner';

const CampaignManager = ({ urls }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ name: '', description: '', color: '#6366f1' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/campaigns');
            setCampaigns(data.data);
        } catch (err) {
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data } = await api.post('/campaigns', newCampaign);
            setCampaigns([...campaigns, data.data]);
            setShowAddModal(false);
            setNewCampaign({ name: '', description: '', color: '#6366f1' });
            toast.success('Campaign initialized');
        } catch (err) {
            toast.error('Initialization failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Destroy this campaign? Links will be un-grouped.')) return;
        try {
            await api.delete(`/campaigns/${id}`);
            setCampaigns(campaigns.filter(c => c._id !== id));
            toast.success('Campaign decommissioned');
        } catch (err) {
            toast.error('Decommission failed');
        }
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
        <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
                <div>
                    <h3 className="text-xl font-black text-black">Campaign Hub.</h3>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">Group and track high-level signal clusters</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
                >
                    <FolderPlus className="w-4 h-4" />
                    New Campaign
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="border border-dashed border-zinc-200 rounded-[32px] p-20 text-center bg-zinc-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 mx-auto border border-zinc-100">
                        <Folder className="w-8 h-8 text-zinc-200" />
                    </div>
                    <h4 className="text-lg font-black text-black mb-1">No campaigns active.</h4>
                    <p className="text-zinc-500 text-xs font-medium mb-6">Group your links into logical buckets for better tracking.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaigns.map((campaign) => {
                        const stats = getCampaignStats(campaign._id);
                        return (
                            <div key={campaign._id} className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: campaign.color }}>
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-black">{campaign.name}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stats.linkCount} Redirect Protocols</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(campaign._id)}
                                        className="p-3 text-zinc-200 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                            <MousePointer2 className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Total Hits</span>
                                        </div>
                                        <p className="font-black text-black font-mono">{stats.totalHits}</p>
                                    </div>
                                    <div className="bg-zinc-50 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                            <Users className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Unique Reach</span>
                                        </div>
                                        <p className="font-black text-black font-mono">{stats.uniqueReach}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CREATE MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-black tracking-tight">Initialize Campaign.</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-zinc-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Campaign Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-sm focus:ring-2 focus:ring-black outline-none"
                                    placeholder="e.g. Winter Sale 2024"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Description (Optional)</label>
                                <textarea
                                    value={newCampaign.description}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-medium text-sm focus:ring-2 focus:ring-black outline-none h-24 resize-none"
                                    placeholder="Describe the objective..."
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">Matrix Color</label>
                                <div className="flex flex-wrap gap-4">
                                    {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9', '#000000'].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewCampaign({ ...newCampaign, color })}
                                            className={`w-10 h-10 rounded-xl transition-all ${newCampaign.color === color ? 'ring-4 ring-zinc-100 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-black/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
                                Deploy Campaign
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignManager;
