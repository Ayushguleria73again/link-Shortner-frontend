"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Shield, Key, User, Globe,
    Save, RefreshCcw, Loader2, Link2,
    Terminal, Smartphone, Bell, PowerOff, Settings
} from 'lucide-react';
import { toast } from 'sonner';
import DestructiveModal from './DestructiveModal';
import DomainManager from './DomainManager';

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
    const [showUsage, setShowUsage] = useState(false);

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

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Left: Editor */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm font-medium">smol.link/</span>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full pl-24 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
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
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    placeholder="e.g. Ayush Guleria"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all h-24 resize-none"
                                    placeholder="Tell your story..."
                                />
                            </div>

                            <div className="pt-6 border-t border-zinc-50">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Social Links</h3>
                                <div className="space-y-3">
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
                                className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 mt-4"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Identity
                            </button>
                        </div>

                        {/* Right: Live Preview */}
                        <div className="bg-zinc-900 rounded-[40px] p-4 border-4 border-zinc-100 shadow-2xl relative overflow-hidden h-fit transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* Phone Notion */}
                            <div className="absolute top-0 inset-x-0 h-6 bg-black/20 z-10 mx-auto w-32 rounded-b-xl backdrop-blur-md" />

                            <div className="bg-white rounded-[32px] h-full min-h-[500px] p-6 flex flex-col items-center text-center pt-16 relative overflow-hidden">
                                {/* Decor Background */}
                                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-50 to-white" />

                                {/* Avatar Mock */}
                                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-xl z-10 border-4 border-white">
                                    {profile.displayName ? profile.displayName[0].toUpperCase() : <User className="w-8 h-8" />}
                                </div>

                                <h3 className="text-lg font-black text-black z-10 mb-1">{profile.displayName || 'Your Name'}</h3>
                                <p className="text-xs font-bold text-zinc-400 z-10 mb-4 bg-zinc-50 px-3 py-1 rounded-full font-mono">
                                    @{profile.username || 'username'}
                                </p>

                                <p className="text-sm text-zinc-600 font-medium z-10 mb-8 max-w-[200px] leading-relaxed">
                                    {profile.bio || 'Your simplified bio will appear here...'}
                                </p>

                                <div className="flex items-center gap-3 z-10">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100 text-zinc-300">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto w-full pt-8 space-y-3 z-10">
                                    <div className="w-full h-12 bg-black text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-lg">
                                        Latest Link
                                    </div>
                                    <div className="w-full h-12 bg-zinc-50 rounded-xl border border-zinc-100" />
                                </div>

                                {/* Footer Brand */}
                                <div className="mt-6 flex items-center gap-1 opacity-50">
                                    <div className="w-3 h-3 bg-black rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">smol.link</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Domain Manager */}
                <DomainManager userPlan={userPlan} />

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
                {/* Usage & Plan Card */}
                <div className="relative group">
                    {/* Animated Border Gradient */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[34px] opacity-75 blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                    <div className="relative bg-zinc-950 text-white rounded-[32px] p-8 overflow-hidden border border-zinc-800">
                        {/* Texture/Pattern */}
                        {/* <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div> */}

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                                    <Shield className={`w-6 h-6 ${userPlan === 'business' ? 'text-amber-400' :
                                        userPlan === 'pro' ? 'text-indigo-400' :
                                            'text-emerald-400'
                                        }`} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Current Protocol</p>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${userPlan === 'business' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                        userPlan === 'pro' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        {userPlan} Tier
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black tracking-tight mb-2 text-white">
                                {userPlan === 'business' ? 'Scale Protocol' : userPlan === 'pro' ? 'Elite Protocol' : userPlan === 'starter' ? 'Growth Protocol' : 'Spark Protocol'}
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8 border-l-2 border-white/10 pl-3">
                                {userPlan === 'free' ? 'Restricted access. Upgrade to unlock full telemetry.' : 'All advanced systems operational. Unlimited bandwidth available.'}
                            </p>

                            {showUsage && userUsage && (
                                <div className="space-y-6 mb-8 bg-white/5 p-6 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
                                    {/* Link Limit */}
                                    <div>
                                        <div className="flex justify-between text-[9px] uppercase font-black tracking-widest mb-2">
                                            <span className="text-zinc-400">Database Entries</span>
                                            <span className="text-white">{userUsage.linksCreated} / {userPlan === 'free' ? '50' : userPlan === 'starter' ? '500' : '∞'}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min((userUsage.linksCreated / (userPlan === 'free' ? 50 : userPlan === 'starter' ? 500 : 10000)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Click Limit */}
                                    <div>
                                        <div className="flex justify-between text-[9px] uppercase font-black tracking-widest mb-2">
                                            <span className="text-zinc-400">Traffic Throughput</span>
                                            <span className="text-white">{userUsage.clicksRecorded.toLocaleString()} / {userPlan === 'free' ? '1k' : userPlan === 'starter' ? '15k' : userPlan === 'pro' ? '150k' : '2M'}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${userUsage.clicksRecorded > (userPlan === 'free' ? 1000 : 15000) ? 'from-rose-600 to-orange-500' : 'from-emerald-600 to-teal-500'}`}
                                                style={{ width: `${Math.min((userUsage.clicksRecorded / (userPlan === 'free' ? 1000 : userPlan === 'starter' ? 15000 : userPlan === 'pro' ? 150000 : 2000000)) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500">Domains Active</span>
                                        <span className="text-[10px] uppercase font-bold text-white">Check Manager Below</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUsage(!showUsage)}
                                    className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_-10px_rgba(255,255,255,0.5)]"
                                >
                                    {showUsage ? 'Hide Telemetry' : 'Check Usage'}
                                    <Shield className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                </button>
                                <button
                                    onClick={() => window.location.href = '/pricing'}
                                    className="px-4 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-bold"
                                    title="Manage Plan"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
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
