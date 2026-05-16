"use client";
import React, { useState } from 'react';
import { X, Save, Shield, Calendar, Power, Loader2, Folder, ExternalLink, Activity, Terminal, Lock, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const SettingsModal = ({ isOpen, onClose, url, onUpdate, campaigns = [] }) => {
    const [formData, setFormData] = useState({
        isActive: url?.isActive ?? true,
        useBridgePage: url?.useBridgePage ?? false,
        password: url?.password || '',
        expiresAt: url?.expiresAt ? new Date(url.expiresAt).toISOString().split('T')[0] : '',
        campaignId: url?.campaignId || ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const accentColor = url?.branding?.accentColor || "#6366f1";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put(`/url/${url._id}`, formData);
            onUpdate(data.data);
            onClose();
        } catch (err) {
            console.error('Update failed:', err);
            // In a real elite app, we'd have a custom toast, but keeping it simple for stability
            alert('Security clearance failed: Could not update parameters.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-zinc-950 border border-white/10 rounded-[48px] w-full max-w-lg overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] relative"
                    >
                        {/* Tactical Background Accents */}
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Activity className="w-64 h-64 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-12 opacity-[0.02] pointer-events-none rotate-12">
                            <Cpu className="w-48 h-48 text-white" />
                        </div>

                        {/* Header */}
                        <div className="p-10 border-b border-white/5 flex items-center justify-between relative bg-white/[0.01]">
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">LINK CONTROL.</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <Terminal className="w-3.5 h-3.5 text-zinc-600" />
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Node: {url.shortCode.toUpperCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-4 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all border border-white/5 group"
                            >
                                <X className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar relative">
                            {/* Operational Status Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Activity className="w-4 h-4 text-zinc-600" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Core Logistics</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`p-6 rounded-[28px] border cursor-pointer transition-all duration-300 space-y-4 flex flex-col items-center text-center ${formData.isActive ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'bg-rose-500/5 border-white/5 grayscale opacity-50'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900 text-zinc-600'}`}>
                                            <Power className="w-5 h-5 shadow-emerald-500/50" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Status</p>
                                            <p className={`text-[11px] font-black uppercase tracking-tighter ${formData.isActive ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                                {formData.isActive ? 'Active Node' : 'Decommissioned'}
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setFormData({ ...formData, useBridgePage: !formData.useBridgePage })}
                                        className={`p-6 rounded-[28px] border cursor-pointer transition-all duration-300 space-y-4 flex flex-col items-center text-center ${formData.useBridgePage ? 'bg-white/5 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'bg-white/[0.02] border-white/5 grayscale opacity-50'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.useBridgePage ? 'bg-white/10 text-white' : 'bg-zinc-900 text-zinc-600'}`}>
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Bridge</p>
                                            <p className={`text-[11px] font-black uppercase tracking-tighter ${formData.useBridgePage ? 'text-white' : 'text-zinc-600'}`}>
                                                {formData.useBridgePage ? 'Premium Enabled' : 'Standard Skip'}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Security & Access */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-zinc-600" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Security Protocols</p>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Set high-security access pin..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-7 text-sm font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    {formData.password && (
                                        <Shield className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    )}
                                </div>
                            </div>

                            {/* Timeline Control */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-zinc-600" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Temporal Lockdown</p>
                                </div>
                                <input
                                    type="date"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-7 text-sm font-bold text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all [color-scheme:dark]"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>

                            {/* Clustering */}
                            <div className="space-y-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <Folder className="w-4 h-4 text-zinc-600" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Intelligence Clustering</p>
                                </div>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-7 text-sm font-bold text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all appearance-none"
                                        value={formData.campaignId}
                                        onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                                    >
                                        <option value="" className="bg-zinc-950">Isolated Runtime (Ungrouped)</option>
                                        {campaigns.map(c => (
                                            <option key={c._id} value={c._id} className="bg-zinc-950">{c.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: campaigns.find(c => c._id === formData.campaignId)?.color || '#333', color: campaigns.find(c => c._id === formData.campaignId)?.color || '#333' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="sticky bottom-0 pt-6 pb-2 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative overflow-hidden bg-white text-black font-black py-6 rounded-[32px] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Synchronize Parameters
                                        </>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10 transition-all group-hover:h-full group-hover:opacity-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
