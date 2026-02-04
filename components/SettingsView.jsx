"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Shield, Key, User, Globe,
    Save, RefreshCcw, Loader2, Link2,
    Terminal, Smartphone, Bell, PowerOff
} from 'lucide-react';
import { toast } from 'sonner';
import DestructiveModal from './DestructiveModal';

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

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [userUsage, setUserUsage] = useState(null); // New state for usage
    const [userPlan, setUserPlan] = useState('free'); // New state for plan

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
            if (userRes.data.data) {
                setApiKey(userRes.data.data.apiKey);
                setUserUsage(userRes.data.data.usage);
                setUserPlan(userRes.data.data.plan);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            toast.error('Failed to sync settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateKey = async () => {
        try {
            const { data } = await api.post('/auth/api-key');
            setApiKey(data.data);
            toast.success('New API encryption key deployed.');
        } catch (err) {
            toast.error('Key generation failed.');
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            await api.post('/profile', profile);
            toast.success('Security clearance updated. Profile saved.');
        } catch (err) {
            toast.error('Protocol error. Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const confirmDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await api.delete('/auth/me');
            toast.success('Account terminated. Goodbye.');
            // Add slight delay for toast to be seen
            setTimeout(() => {
                handleLogout();
            }, 1500);
        } catch (err) {
            toast.error('Termination failed. Contact support.');
            setIsDeleting(false);
            setShowDeleteModal(false);
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
            {/* Delete Confirmation Modal */}
            <DestructiveModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteAccount}
                title="Self-Destruct Sequence"
                description="This action will permanently wipe your user data, profile identity, and all active tracking links. This process is irreversible."
                confirmText="Terminate Account"
                verificationText="DELETE"
                loading={isDeleting}
            />

            {/* Link Hub Settings */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <User className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Link Hub Identity</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">smol.link/u/</span>
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

            <div className="space-y-8">
                {/* Usage & Plan Card */}
                <div className="bg-black text-white rounded-[32px] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] -mr-16 -mt-16" />

                    <div className="flex items-center justify-between mb-6">
                        <Shield className="w-8 h-8 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                            {userPlan} Tier
                        </span>
                    </div>

                    <h3 className="text-xl font-black tracking-tight mb-2 uppercase">
                        {userPlan === 'business' ? 'Scale Protocol' : userPlan === 'pro' ? 'Elite Protocol' : userPlan === 'starter' ? 'Growth Protocol' : 'Spark Protocol'}
                    </h3>
                    <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8">
                        {userPlan === 'free' ? 'Upgrade to unlock advanced analytics and more links.' : 'All advanced systems active.'}
                    </p>

                    {userUsage && (
                        <div className="space-y-6 mb-8">
                            {/* Link Limit */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2">
                                    <span className="text-zinc-400">Links Created</span>
                                    <span>{userUsage.linksCreated} / {userPlan === 'free' ? '50' : userPlan === 'starter' ? '500' : '∞'}</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min((userUsage.linksCreated / (userPlan === 'free' ? 50 : userPlan === 'starter' ? 500 : 10000)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Click Limit */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2">
                                    <span className="text-zinc-400">Monthly Clicks</span>
                                    <span>{userUsage.clicksRecorded.toLocaleString()} / {userPlan === 'free' ? '1k' : userPlan === 'starter' ? '15k' : userPlan === 'pro' ? '150k' : '2M'}</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${userUsage.clicksRecorded > (userPlan === 'free' ? 1000 : 15000) ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min((userUsage.clicksRecorded / (userPlan === 'free' ? 1000 : userPlan === 'starter' ? 15000 : userPlan === 'pro' ? 150000 : 2000000)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all">
                        {userPlan === 'business' ? 'Manage Subscription' : 'Upgrade Plan'}
                    </button>
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

                {/* Account Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 bg-zinc-100 text-zinc-600 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all border border-zinc-200"
                    >
                        <PowerOff className="w-4 h-4" />
                        Log Out
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full flex items-center justify-center gap-3 bg-rose-50 text-rose-500 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all border border-rose-100 group"
                    >
                        <PowerOff className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                        Delete Account
                    </button>
                </div>
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
