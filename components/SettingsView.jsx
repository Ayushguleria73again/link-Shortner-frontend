"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Shield, Key, User, Globe,
    Save, RefreshCcw, Loader2, Link2,
    Terminal, Smartphone, Bell, PowerOff
} from 'lucide-react';

export default function SettingsView() {
    const [profile, setProfile] = useState({
        username: '',
        displayName: '',
        bio: '',
        socialLinks: { twitter: '', github: '', linkedin: '', instagram: '' }
    });
    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const [profileRes, userRes] = await Promise.all([
                api.get('/profile/me'),
                api.get('/auth/me')
            ]);

            if (profileRes.data.data) {
                setProfile(profileRes.data.data);
            }
            if (userRes.data.data.apiKey) {
                setApiKey(userRes.data.data.apiKey);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateKey = async () => {
        try {
            const { data } = await api.post('/auth/api-key');
            setApiKey(data.data);
            alert('New API encryption key deployed.');
        } catch (err) {
            alert('Key generation failed.');
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            await api.post('/profile', profile);
            alert('Security clearance updated. Profile saved.');
        } catch (err) {
            alert('Protocol error. Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Syncing Settings...</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Link Hub Settings */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <User className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Link Hub Identity</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Matrix Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">shorty.me/u/</span>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full pl-24 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Display Name</label>
                                <input
                                    type="text"
                                    value={profile.displayName}
                                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Identity Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all h-32 resize-none"
                                placeholder="Tell the world who you are..."
                            />
                        </div>

                        <div className="pt-6 border-t border-zinc-50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Social Integration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SocialInput
                                    label="Twitter"
                                    value={profile.socialLinks.twitter}
                                    onChange={(val) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: val } })}
                                />
                                <SocialInput
                                    label="Github"
                                    value={profile.socialLinks.github}
                                    onChange={(val) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: val } })}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-3 bg-black text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Update Global Identity
                        </button>
                    </div>
                </div>

                {/* Developer API Section */}
                <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Terminal className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Developer Access Port</h2>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Master API Key</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase px-2 py-1 bg-emerald-50 rounded-md">Alpha Access</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 font-mono text-xs text-zinc-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                {apiKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                            </div>
                            <button
                                onClick={handleGenerateKey}
                                className="bg-black text-white px-4 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="mt-4 text-[10px] text-zinc-400 font-medium">Use this key to automate link creation via our Terminal API. Keep it secure.</p>
                    </div>
                </div>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-8">
                <div className="bg-black text-white rounded-[32px] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] -mr-16 -mt-16" />
                    <Shield className="w-8 h-8 mb-6 text-indigo-400" />
                    <h3 className="text-xl font-black tracking-tight mb-4 uppercase">Elite Pro.</h3>
                    <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8">You are currently on the Enterprise Protocol. All advanced trackers and API shards are active.</p>
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Manage License</button>
                </div>

                <div className="bg-zinc-50 border border-zinc-100 rounded-[32px] p-8">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                        <Bell className="w-3 h-3" />
                        System Config
                    </h3>
                    <div className="space-y-4">
                        <ConfigToggle label="Email Notifications" active={true} />
                        <ConfigToggle label="Weekly Insight Logs" active={false} />
                        <ConfigToggle label="Brute-Force Armor" active={true} />
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-3 bg-rose-50 text-rose-500 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-100 transition-all border border-rose-100">
                    <PowerOff className="w-4 h-4" />
                    Terminate Session
                </button>
            </div>
        </div>
    );
}

function SocialInput({ label, value, onChange }) {
    return (
        <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder={`${label} Profile URL`}
            />
        </div>
    );
}

function ConfigToggle({ label, active }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-600">{label}</span>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-black' : 'bg-zinc-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : ''}`} />
            </div>
        </div>
    );
}
