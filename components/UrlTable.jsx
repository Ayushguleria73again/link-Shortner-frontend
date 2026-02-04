"use client";
import React, { useState } from 'react';
import {
    Copy, Trash2, BarChart2, CheckCircle2,
    Settings, QrCode, ExternalLink, Shield, CalendarOff, PowerOff,
    Folder
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

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001').replace(/\/$/, "");

    if (urls.length === 0) {
        return (
            <div className="border border-dashed border-zinc-200 rounded-[32px] p-24 text-center bg-zinc-50/30">
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No entries found in your registry</p>
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
                                                    onClick={() => copyToClipboard(`${baseUrl}/${url.shortCode}`, url._id)}
                                                    className="text-zinc-300 hover:text-black transition-colors"
                                                >
                                                    {copiedId === url._id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                                <a href={`${baseUrl}/${url.shortCode}`} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-indigo-500">
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
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full w-fit">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-black uppercase">Live</span>
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
                        shortUrl={`${baseUrl}/${selectedUrl.shortCode}`}
                        shortCode={selectedUrl.shortCode}
                    />
                    <SettingsModal
                        isOpen={showSettings}
                        onClose={() => setShowSettings(false)}
                        url={selectedUrl}
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
