"use client";
import React, { useState } from 'react';
import {
    Copy, Trash2, BarChart2, CheckCircle2,
    Settings, QrCode, ExternalLink, Shield, CalendarOff, PowerOff,
    Folder,
    Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/lib/api';
import QrModal from './QrModal';
import SettingsModal from './SettingsModal';

const UrlTable = ({ urls, onDelete, onSelect, onUpdate }) => {
    const [copiedId, setCopiedId] = React.useState(null);
    const [selectedUrl, setSelectedUrl] = useState(null);
    const [showQr, setShowQr] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    React.useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/campaigns');
            setCampaigns(data.data);
        } catch (err) { }
    };

    const handleAssignCampaign = async (urlId, campaignId) => {
        try {
            const { data } = await api.put(`/url/${urlId}`, { campaignId: campaignId || null });
            onUpdate(data.data);
            toast.success('Assignment updated');
        } catch (err) {
            toast.error('Assignment failed');
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';

    if (urls.length === 0) {
        return (
            <div className="border border-dashed border-zinc-200 rounded-[32px] p-24 text-center bg-zinc-50/30">
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No entries found in your collection</p>
            </div>
        );
    }

    const handleSettings = (url) => {
        setSelectedUrl(url);
        setShowSettings(true);
    };

    const handleQr = (url) => {
        setSelectedUrl(url);
        setShowQr(true);
    };

    return (
        <>
            <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-50 bg-zinc-50/30">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Short Link</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Security / Metrics</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Campaign</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {urls.map((url) => (
                                <tr key={url._id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-black text-lg tracking-tight">{url.shortCode}</span>
                                                <button
                                                    onClick={() => {
                                                        const link = url.customDomain ? `https://${url.customDomain}/${url.shortCode}` : `${baseUrl}/${url.shortCode}`;
                                                        copyToClipboard(link, url._id);
                                                    }}
                                                    className="text-zinc-300 hover:text-black transition-colors"
                                                >
                                                    {copiedId === url._id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                                <a
                                                    href={url.customDomain ? `https://${url.customDomain}/${url.shortCode}` : `${baseUrl}/${url.shortCode}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-zinc-300 hover:text-indigo-500"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                            <p className="text-[11px] text-zinc-400 truncate max-w-[200px] font-medium uppercase tracking-widest">
                                                {url.originalUrl.replace(/^https?:\/\//, '')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-black text-black">{url.totalClicks}</span>
                                                <span className="text-[9px] font-black text-zinc-300 uppercase">Hits</span>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                {url.password && (
                                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500" title="Password Protected">
                                                        <Shield className="w-3 h-3" />
                                                    </div>
                                                )}
                                                {url.expiresAt && (
                                                    <div className="p-2 bg-amber-50 rounded-lg text-amber-500" title="Has Expiration">
                                                        <CalendarOff className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <div className="relative group/camp items-center flex gap-2 bg-zinc-50 border border-zinc-100 px-3 py-2 rounded-xl transition-all hover:bg-white hover:border-zinc-200">
                                                <Folder
                                                    className="w-3 h-3 transition-colors"
                                                    style={{ color: campaigns.find(c => c._id === url.campaignId)?.color || '#e4e4e7' }}
                                                />
                                                <select
                                                    value={url.campaignId || ''}
                                                    onChange={(e) => handleAssignCampaign(url._id, e.target.value)}
                                                    className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none"
                                                >
                                                    <option value="">Ungrouped</option>
                                                    {campaigns.map(c => (
                                                        <option key={c._id} value={c._id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        {!url.isActive ? (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full w-fit">
                                                <PowerOff className="w-3 h-3" />
                                                <span className="text-[9px] font-black uppercase">Offline</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full w-fit">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[9px] font-black uppercase">Live</span>
                                                </div>
                                                {url.health && (
                                                    <div
                                                        className={`flex items-center gap-2 px-2 py-0.5 rounded-md w-fit border transition-all cursor-default relative group/health ${url.health.status === 'online' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' :
                                                            url.health.status === 'offline' ? 'bg-rose-50/50 border-rose-100 text-rose-600' :
                                                                'bg-zinc-50 border-zinc-100 text-zinc-400'
                                                            }`}
                                                    >
                                                        <Activity className="w-2.5 h-2.5" />
                                                        <span className="text-[8px] font-black uppercase tracking-tighter">{url.health.status} Heartbeat</span>

                                                        {/* Intelligence Tooltip */}
                                                        <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-black text-white text-[9px] p-3 rounded-xl opacity-0 invisible group-hover/health:opacity-100 group-hover/health:visible transition-all shadow-2xl z-50 pointer-events-none">
                                                            <div className="flex flex-col gap-1.5">
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <span className="text-zinc-500 font-black uppercase">Latency</span>
                                                                    <span className="font-mono">{url.health.latency ? `${url.health.latency}ms` : 'N/A'}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <span className="text-zinc-500 font-black uppercase">Last Check</span>
                                                                    <span className="font-mono">{url.health.lastChecked ? format(new Date(url.health.lastChecked), 'HH:mm:ss') : 'N/A'}</span>
                                                                </div>
                                                                {url.health.lastError && (
                                                                    <div className="pt-1.5 border-t border-white/10 mt-1 text-rose-400 font-bold leading-tight">
                                                                        Error: {url.health.lastError}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="absolute top-full left-4 border-8 border-transparent border-t-black" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleQr(url)}
                                                className="p-3 bg-white border border-zinc-100 text-zinc-400 hover:text-black hover:border-black rounded-2xl transition-all shadow-sm"
                                                title="Generate QR"
                                            >
                                                <QrCode className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleSettings(url)}
                                                className="p-3 bg-white border border-zinc-100 text-zinc-400 hover:text-black hover:border-black rounded-2xl transition-all shadow-sm"
                                                title="Settings"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onSelect(url.shortCode)}
                                                className="p-3 bg-black text-white hover:bg-zinc-800 rounded-2xl transition-all shadow-md"
                                                title="View Analytics"
                                            >
                                                <BarChart2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(url._id)}
                                                className="p-3 text-zinc-300 hover:text-rose-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUrl && (
                <>
                    <QrModal
                        isOpen={showQr}
                        onClose={() => setShowQr(false)}
                        shortUrl={selectedUrl.customDomain ? `https://${selectedUrl.customDomain}/${selectedUrl.shortCode}` : `${baseUrl}/${selectedUrl.shortCode}`}
                        shortCode={selectedUrl.shortCode}
                    />
                    <SettingsModal
                        isOpen={showSettings}
                        onClose={() => setShowSettings(false)}
                        url={selectedUrl}
                        campaigns={campaigns}
                        onUpdate={(updated) => {
                            onUpdate(updated);
                            setSelectedUrl(updated);
                        }}
                    />
                </>
            )}
        </>
    );
};

export default UrlTable;
