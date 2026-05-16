"use client";
import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import {
    Shield, Key, User, Globe,
    Save, RefreshCcw, Loader2, Link2,
    Terminal, Smartphone, Bell, PowerOff, Settings,
    Palette, Layout, Image, Database, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import DestructiveModal from '@/components/ui/DestructiveModal';
import DomainManager from '@/components/dashboard/management/DomainManager';
import CampaignManager from '@/components/dashboard/management/CampaignManager';

import { 
    useUserAuth, 
    useUpdateProfile, 
    useUpdateBranding, 
    useUpdateSettings, 
    useGenerateApiKey, 
    useDeleteAccount 
} from '@/hooks/useQueries';

export default function SettingsView({ urls, onUpdateUrl, onCampaignSelect }) {
    // Centralized Data Hooks
    const { data: userData, isLoading: loading } = useUserAuth();
    
    // Derived Local State (for UI editing)
    const [profile, setProfile] = useState({
        username: '',
        displayName: '',
        bio: '',
        socialLinks: { twitter: '', github: '', linkedin: '', instagram: '' }
    });
    const [settings, setSettings] = useState({
        emailNotifications: true,
        weeklyInsights: false,
        bruteForceArmor: true
    });
    const [branding, setBranding] = useState({
        logo: '',
        primaryColor: '#6366f1',
        theme: 'glass',
        companyName: ''
    });

    const [showUsage, setShowUsage] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const timeoutRef = useRef(null);

    // Sync local state when server data arrives
    useEffect(() => {
        if (userData) {
            if (userData.profile) setProfile(userData.profile);
            if (userData.settings) setSettings(userData.settings);
            if (userData.branding) setBranding(userData.branding);
        }
    }, [userData]);

    const userPlan = userData?.plan || 'free';
    const apiKey = userData?.apiKey;
    const userUsage = userData?.usage;

    // Mutation Hooks
    const { mutate: updateProfile, isPending: saving } = useUpdateProfile();
    const { mutate: updateBranding } = useUpdateBranding();
    const { mutate: updateSettings } = useUpdateSettings();
    const { mutate: generateApiKey } = useGenerateApiKey();
    const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

    const handleUpdateBranding = (key, value) => {
        const newBranding = { ...branding, [key]: value };
        setBranding(newBranding);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            updateBranding(newBranding);
        }, 1200);
    };

    const handleUpdateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        updateSettings(newSettings);
    };

    const handleSaveProfile = () => {
        if (!profile.username) return toast.error('Please enter a username.');
        updateProfile(profile);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (loading) return (
        <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Loading Settings...</p>
        </div>
    );
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Delete Confirmation Modal */}
            <DestructiveModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => deleteAccount()}
                title="Delete Account"
                description="This action will permanently wipe your user data, profile identity, and all active tracking links. This process is irreversible."
                confirmText="Terminate Account"
                verificationText="DELETE"
                loading={isDeleting}
            />

            {/* Link Hub Settings */}
            <div className="lg:col-span-2 space-y-8">
                {/* Profile Identity & Digital Persona */}
                <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <User className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Profile Identity</h2>
                                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Control how you appear across the smol. network.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                        >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Save Changes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Universal Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 text-xs font-bold">smol.link/u/</span>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                                        className="w-full pl-[88px] pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all"
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
                                    className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                                    placeholder="Your full name or alias"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Short Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all h-[132px] resize-none"
                                placeholder="Tell the world who you are in a few words..."
                            />
                        </div>
                    </div>

                    <div className="pt-10 border-t border-zinc-50">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Social Connections</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <SocialInput 
                                label="Twitter" 
                                value={profile.socialLinks?.twitter} 
                                onChange={(val) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: val } })}
                            />
                            <SocialInput 
                                label="GitHub" 
                                value={profile.socialLinks?.github} 
                                onChange={(val) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: val } })}
                            />
                            <SocialInput 
                                label="LinkedIn" 
                                value={profile.socialLinks?.linkedin} 
                                onChange={(val) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: val } })}
                            />
                            <SocialInput 
                                label="Instagram" 
                                value={profile.socialLinks?.instagram} 
                                onChange={(val) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, instagram: val } })}
                            />
                        </div>
                    </div>
                </div>

                {/* Operational Campaign Manager */}
                <div className="relative overflow-hidden rounded-[32px]">
                    {['free', 'starter'].includes(userPlan) && (
                        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-[32px] border border-zinc-100">
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                                <Database className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-2">Campaign Management</h3>
                            <p className="text-xs text-zinc-500 font-medium max-w-[240px] mb-6">Upgrade to Pro to organize your signals into grouped campaigns and folders.</p>
                            <button
                                onClick={() => window.location.href = '/pricing'}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Unlock Campaigns
                            </button>
                        </div>
                    )}
                    <CampaignManager
                        urls={urls}
                        onUpdateUrl={onUpdateUrl}
                        onCampaignSelect={onCampaignSelect}
                    />
                </div>

                {/* Custom Domain Manager */}
                <DomainManager userPlan={userPlan} />

                {/* Personalization & Redirection Aesthetics */}
                <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
                    {/* Elite Gate */}
                    {['free', 'starter'].includes(userPlan) && (
                        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                                <Palette className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-2">Premium Customization</h3>
                            <p className="text-xs text-zinc-500 font-medium max-w-[240px] mb-6">Upgrade to Pro to white-label your redirection bridge pages with custom branding.</p>
                            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                Unlock Branding
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-8">
                        <Palette className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Custom Branding</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Company Name</label>
                                <input
                                    type="text"
                                    value={branding.companyName}
                                    onChange={(e) => handleUpdateBranding('companyName', e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Logo URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={branding.logo}
                                        onChange={(e) => handleUpdateBranding('logo', e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="https://..."
                                    />
                                    {branding.logo && (
                                        <div className="w-11 h-11 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                                            <img src={branding.logo} className="max-w-[80%] max-h-[80%] object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Brand Accent Color</label>
                                <div className="flex items-center gap-4 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                                    <input
                                        type="color"
                                        value={branding.primaryColor}
                                        onChange={(e) => handleUpdateBranding('primaryColor', e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                                    />
                                    <span className="text-xs font-mono font-bold uppercase">{branding.primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Bridge Theme</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['glass', 'neo', 'dark', 'minimal'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => handleUpdateBranding('theme', t)}
                                            className={`py-2 px-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${branding.theme === t
                                                ? 'bg-black text-white border-black shadow-lg'
                                                : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-50 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <Layout className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-black uppercase">Live Branding Preview</p>
                            <p className="text-[10px] text-zinc-400 font-medium">Changes are mirrored in real-time across your branded links.</p>
                        </div>
                    </div>
                </div>

                        {/* API KEY SECTION */}
                        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 mt-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-indigo-500" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em]">Developer Access</h2>
                                </div>
                                <button
                                    onClick={() => generateApiKey()}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    <RefreshCcw className="w-3 h-3" />
                                    Rotate Key
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Your API Key</label>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            type="password"
                                            value={apiKey || '••••••••••••••••'}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(apiKey);
                                                toast.success('API Key copied to clipboard');
                                            }}
                                            className="px-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-zinc-400 mt-3 flex items-center gap-1.5">
                                        <Shield className="w-3 h-3" />
                                        Keep this key secure. It provides full access to your account signals via the API.
                                    </p>
                                </div>
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
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Your Plan</p>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${userPlan === 'business' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                        userPlan === 'pro' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        {userPlan} Plan
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black tracking-tight mb-2 text-white">
                                {userPlan === 'business' ? 'Enterprise Plan' : userPlan === 'pro' ? 'Advanced Plan' : userPlan === 'starter' ? 'Growth Plan' : 'Basic Plan'}
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-8 border-l-2 border-white/10 pl-3">
                                {userPlan === 'free' ? 'Basic access. Upgrade to unlock more features.' : 'All systems operational. Advanced features active.'}
                            </p>

                            {showUsage && userUsage && (
                                <div className="space-y-6 mb-8 bg-white/5 p-6 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
                                    {/* Link Limit */}
                                    <div>
                                        <div className="flex justify-between text-[9px] uppercase font-black tracking-widest mb-2">
                                            <span className="text-zinc-400">Links Created</span>
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
                                            <span className="text-zinc-400">Monthly Clicks</span>
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
                                    {showUsage ? 'Hide Usage' : 'Check Usage'}
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
                        System Settings
                    </h3>
                    <div className="space-y-4">
                        <ConfigToggle
                            label="Email Notifications"
                            active={settings.emailNotifications}
                            onToggle={() => handleUpdateSetting('emailNotifications', !settings.emailNotifications)}
                        />
                        <ConfigToggle
                            label="Weekly Performance Reports"
                            active={settings.weeklyInsights}
                            onToggle={() => handleUpdateSetting('weeklyInsights', !settings.weeklyInsights)}
                        />
                        <ConfigToggle
                            label="Brute-Force Protection"
                            active={settings.bruteForceArmor}
                            onToggle={() => handleUpdateSetting('bruteForceArmor', !settings.bruteForceArmor)}
                        />
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

function ConfigToggle({ label, active, onToggle }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-600">{label}</span>
            <button
                onClick={onToggle}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-black' : 'bg-zinc-200'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : ''}`} />
            </button>
        </div>
    );
}
