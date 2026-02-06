"use client";
import React from 'react';
import {
    X, Shield, Globe, Monitor,
    Smartphone, Tablet, Terminal,
    MapPin, Clock, ArrowRight,
    Activity, Fingerprint, Lock,
    Cpu, MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function SignalReport({ click, onClose, userPlan }) {
    if (!click) return null;

    // Partial IP masking for privacy
    const maskIp = (ip) => {
        if (!ip) return 'x.x.x.x';
        const parts = ip.split('.');
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.x.x`;
        }
        return ip.substring(0, 8) + '...';
    };

    const getDeviceIcon = (device) => {
        switch (device) {
            case 'mobile': return <Smartphone className="w-4 h-4" />;
            case 'tablet': return <Tablet className="w-4 h-4" />;
            default: return <Monitor className="w-4 h-4" />;
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex justify-end">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Slide-over */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col text-zinc-900 border-l border-zinc-100"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Signal Intelligence</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">Report ID: {click._id?.substring(0, 8) || 'ELITE-NULL'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                        {/* Primary Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <MetricBox
                                label="Identity Verification"
                                value={click.isBot ? 'Bot/Crawler' : 'Human Host'}
                                icon={<Fingerprint className={click.isBot ? 'text-orange-500' : 'text-emerald-500'} />}
                                status={click.isBot ? 'Flagged' : 'Verified'}
                            />
                            <MetricBox
                                label="Protocol Handshake"
                                value={click.protocol?.toUpperCase() || 'HTTP/1.1'}
                                icon={<Lock className="text-indigo-500" />}
                                status="Encrypted"
                            />
                        </div>

                        {/* Geographical Cluster */}
                        <div className="space-y-4">
                            <SectionHeader title="Geographical Cluster" icon={<Globe className="w-3.5 h-3.5" />} />
                            <div className="bg-zinc-50 rounded-3xl p-6 space-y-4 border border-zinc-100">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-sm">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Origin Point</p>
                                            <p className="text-sm font-black">{click.city}, {click.country}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">IP ADDRESS</p>
                                        <p className="text-xs font-mono font-bold text-zinc-500">{maskIp(click.ip)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1 pt-2 border-t border-zinc-200/50">
                                    <Clock className="w-3 h-3" />
                                    Synced {format(new Date(click.createdAt), 'MMM dd, HH:mm:ss')}
                                </div>
                            </div>
                        </div>

                        {/* Technical Sections Gated */}
                        {['free', 'starter'].includes(userPlan) ? (
                            <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-100 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Shield className="w-16 h-16" />
                                </div>
                                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
                                    <Lock className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2">Elite Intelligence Restricted</h3>
                                    <p className="text-xs text-zinc-500 font-medium max-w-[240px]">Upgrade to the Elite Protocol to unlock technical fingerprints, request protocols, and full signal path intelligence.</p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/pricing'}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    Unlock Elite G-14
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Technical Parameters */}
                                <div className="space-y-4">
                                    <SectionHeader title="Technical Parameters" icon={<Terminal className="w-3.5 h-3.5" />} />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <TechParam icon={<Cpu />} label="Environment" value={click.os || 'Unknown Core'} />
                                        <TechParam icon={getDeviceIcon(click.device)} label="Visualizer" value={click.browser || 'Unknown'} />
                                        <TechParam icon={<MousePointer2 />} label="Interaction" value={click.referrer === 'Direct' ? 'Direct Handshake' : click.referrer} />
                                    </div>
                                </div>

                                {/* Path Intelligence */}
                                <div className="space-y-4">
                                    <SectionHeader title="Signal Path" icon={<Activity className="w-3.5 h-3.5" />} />
                                    <div className="bg-black text-white p-6 rounded-3xl font-mono text-xs relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Terminal className="w-12 h-12" />
                                        </div>
                                        <div className="flex flex-col gap-2 relative z-10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-indigo-400 font-black">GET</span>
                                                <span className="text-emerald-400">{click.path || `/u/${click.shortCode}`}</span>
                                            </div>
                                            <div className="h-px bg-zinc-800 my-2" />
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-500">Destination:</span>
                                                <span className="flex items-center gap-2"> smol.link/{click.shortCode} <ArrowRight className="w-3 h-3 text-zinc-600" /> [Live]</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* UTM Cluster */}
                                {click.utm && Object.values(click.utm).some(v => v) && (
                                    <div className="space-y-4">
                                        <SectionHeader title="Campaign Metadata" icon={<Activity className="w-3.5 h-3.5" />} />
                                        <div className="grid grid-cols-1 gap-2">
                                            {Object.entries(click.utm).map(([key, value]) => value && (
                                                <div key={key} className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{key}</span>
                                                    <span className="text-xs font-bold text-zinc-700">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-zinc-100 bg-zinc-50/50">
                        <div className="flex items-center gap-2 opacity-20 filter grayscale">
                            <div className="w-2.5 h-2.5 bg-black rounded-full" />
                            <span className="text-[10px] font-black tracking-tighter">smol elite intelligence.</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function MetricBox({ label, value, icon, status }) {
    return (
        <div className="p-5 bg-zinc-50 rounded-3xl border border-zinc-100 relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                    <p className="text-xs font-black">{value}</p>
                </div>
            </div>
            <div className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-white border border-zinc-200 rounded-full inline-block">
                {status}
            </div>
        </div>
    );
}

function SectionHeader({ title, icon }) {
    return (
        <div className="flex items-center gap-2 ml-1">
            {icon}
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
        </div>
    );
}

function TechParam({ icon, label, value }) {
    return (
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <div className="mx-auto w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-zinc-400 mb-2">
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{label}</p>
            <p className="text-[10px] font-bold truncate">{value}</p>
        </div>
    );
}
