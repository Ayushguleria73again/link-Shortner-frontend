"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    User, Link2, ExternalLink, Globe,
    Twitter, Github, Linkedin, Instagram,
    ShieldCheck, Loader2, Save, BarChart3,
    TrendingUp, Users, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function HubView({ username, userPlan }) {
    const [profile, setProfile] = useState({
        username: '',
        displayName: '',
        bio: '',
        socialLinks: { twitter: '', github: '', linkedin: '', instagram: '' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        if (username) {
            fetchHubData();
        }
    }, [username]);

    const fetchHubData = async () => {
        try {
            setLoading(true);
            const [profileRes, hubRes] = await Promise.all([
                api.get('/profile/me'),
                username ? api.get(`/profile/${username}`) : Promise.resolve({ data: { data: null } })
            ]);

            if (profileRes.data.data) {
                setProfile(profileRes.data.data);
            }
            if (hubRes.data.data) {
                setLinks(hubRes.data.data.links || []);
            }
        } catch (err) {
            console.error('Error fetching hub data:', err);
            toast.error('Failed to synchronize hub protocols.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.post('/profile', profile);
            toast.success('Identity synchronized. Link Hub updated.');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Sync failed.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Synchronizing Hub Protocols...</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column: Editor & Stats */}
            <div className="lg:col-span-7 space-y-8">
                {/* Hub Stats Card */}
                <div className="bg-black text-white rounded-[32px] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <BarChart3 className="w-24 h-24" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-indigo-500" />
                            Hub Telemetry
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Public Reach</p>
                                <p className="text-3xl font-black font-mono">{links.reduce((acc, curr) => acc + curr.totalClicks, 0).toLocaleString()}</p>
                                <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase mt-1">
                                    <TrendingUp className="w-2 h-2" />
                                    Signal Active
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Indices</p>
                                <p className="text-3xl font-black font-mono">{links.length}</p>
                                <div className="text-[8px] font-black text-zinc-500 uppercase mt-1">
                                    Active Clusters
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase font-mono">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Identity Editor */}
                <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
                    {/* Elite Gate */}
                    {['free', 'starter'].includes(userPlan) && (
                        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-2">Elite Identity Control</h3>
                            <p className="text-xs text-zinc-500 font-medium max-w-[240px] mb-6">Upgrade to Pro to synchronize your public identity and unlock live Hub telemetry.</p>
                            <button
                                onClick={() => window.location.href = '/pricing'}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Unlock Elite Protocol
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Identity Protocol</h2>
                        </div>
                        <a
                            href={`/u/${profile.username}`}
                            target="_blank"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live View
                        </a>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs font-bold">/u/</span>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Display Name</label>
                                <input
                                    type="text"
                                    value={profile.displayName}
                                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Mission Statement (Bio)</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all h-24 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SocialInput
                                label="Twitter"
                                value={profile.socialLinks?.twitter}
                                onChange={(v) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: v } })}
                            />
                            <SocialInput
                                label="GitHub"
                                value={profile.socialLinks?.github}
                                onChange={(v) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: v } })}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 mt-4"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Synchronize Identity
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Live Sandbox Preview */}
            <div className="lg:col-span-5 relative">
                <div className="sticky top-32">
                    <div className="flex items-center gap-3 mb-6 px-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sandbox Preview</h3>
                    </div>

                    <div className="bg-zinc-950 rounded-[48px] p-5 shadow-2xl border-[8px] border-zinc-900 h-[650px] relative overflow-hidden group">
                        {/* Background Decor */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                        <div className="bg-white rounded-[40px] h-full overflow-y-auto custom-scrollbar relative">
                            {/* Header */}
                            <div className="pt-16 pb-12 flex flex-col items-center text-center px-6 relative">
                                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-50/50 to-white" />

                                <div className="w-24 h-24 bg-zinc-100 rounded-[32px] mb-6 shadow-xl border-4 border-white flex items-center justify-center text-3xl font-black text-zinc-300 relative z-10 overflow-hidden">
                                    {profile.displayName?.charAt(0).toUpperCase() || <User className="w-10 h-10" />}
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <h4 className="text-xl font-black tracking-tight">{profile.displayName || 'Identity Pending'}</h4>
                                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">@{profile.username || 'unknown'}</p>
                                    <p className="text-sm text-zinc-500 font-medium px-4 leading-relaxed">
                                        {profile.bio || 'Waiting for mission intelligence...'}
                                    </p>
                                </div>
                            </div>

                            {/* Links List */}
                            <div className="px-6 pb-20 space-y-3">
                                {links.slice(0, 5).map((link, i) => (
                                    <div key={i} className="group/link block bg-zinc-50 border border-zinc-100 p-4 rounded-2xl transition-all hover:bg-white hover:border-black hover:shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-zinc-400 group-hover/link:bg-black group-hover/link:text-white transition-colors">
                                                    <Link2 className="w-4 h-4" />
                                                </div>
                                                <div className="text-xs font-bold truncate max-w-[140px]">{link.title || link.shortCode}</div>
                                            </div>
                                            <ExternalLink className="w-3 h-3 text-zinc-300" />
                                        </div>
                                    </div>
                                ))}
                                {links.length === 0 && (
                                    <div className="py-12 flex flex-col items-center gap-2 text-zinc-300">
                                        <Globe className="w-8 h-8 opacity-20" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">No Active Signals</span>
                                    </div>
                                )}
                            </div>

                            {/* Branding */}
                            <div className="mt-auto py-8 flex flex-col items-center gap-2 opacity-30 sticky bottom-0 bg-white/80 backdrop-blur-sm w-full border-t border-zinc-50">
                                <div className="flex items-center gap-1.5 font-black text-sm">
                                    <div className="w-2.4 h-2.4 bg-black rounded-full" />
                                    smol.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialInput({ label, value, onChange }) {
    return (
        <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">{label}</label>
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-zinc-300"
                placeholder={`${label} Protocol Link`}
            />
        </div>
    );
}
