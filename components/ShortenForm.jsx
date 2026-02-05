"use client";
import React, { useState } from 'react';
import { ArrowRight, LinkIcon, Sparkles, Loader2, Database } from 'lucide-react';
import api from '@/lib/api';

const ShortenForm = ({ onUrlCreated }) => {
    const [url, setUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [isOneTime, setIsOneTime] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Custom Domain & Campaign Logic
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [domainRes, campaignRes] = await Promise.all([
                    api.get('/domains'),
                    api.get('/campaigns')
                ]);
                const verifiedDefaults = domainRes.data.data.filter(d => d.verified);
                setDomains(verifiedDefaults);
                setCampaigns(campaignRes.data.data);
            } catch (err) {
                console.error('Failed to load metadata');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/url/shorten', {
                originalUrl: url,
                customAlias: alias,
                isOneTime,
                customDomain: selectedDomain || null,
                campaignId: selectedCampaign || null
            });
            setUrl('');
            setAlias('');
            setIsOneTime(false);
            setSelectedCampaign('');
            onUrlCreated(data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to shorten URL');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-zinc-200 bg-white p-6 md:p-10 rounded-3xl mb-12">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-12 lg:col-span-4 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Original URL</label>
                            <div className="relative">
                                <input
                                    id="url-input"
                                    type="url"
                                    required
                                    placeholder="https://example.com/very-long-path"
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 px-6 text-black placeholder:text-zinc-300 focus:outline-none focus:border-black transition-all font-medium text-sm"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Domain Selector */}
                        <div className="md:col-span-12 lg:col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Domain</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-bold text-sm appearance-none"
                                    value={selectedDomain}
                                    onChange={(e) => setSelectedDomain(e.target.value)}
                                >
                                    <option value="">smol.link</option>
                                    {domains.map(d => (
                                        <option key={d._id} value={d.domain}>{d.domain}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Sparkles className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-12 lg:col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Custom Alias</label>
                            <input
                                type="text"
                                placeholder="alias"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 px-6 text-black placeholder:text-zinc-300 focus:outline-none focus:border-black transition-all font-bold text-sm"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                            />
                        </div>

                        {/* Campaign Selector */}
                        <div className="md:col-span-12 lg:col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Campaign</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 px-6 text-black focus:outline-none focus:border-black transition-all font-bold text-sm appearance-none"
                                    value={selectedCampaign}
                                    onChange={(e) => setSelectedCampaign(e.target.value)}
                                >
                                    <option value="">No Campaign</option>
                                    {campaigns.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Database className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-12 lg:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all h-[54px] text-xs uppercase tracking-widest shadow-lg shadow-black/10"
                            >
                                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'SHORTEN'}
                            </button>
                        </div>
                    </div>

                    {/* Checkbox moved to a separate row for better alignment of the main inputs */}
                    <div className="flex items-center gap-2 px-1">
                        <input
                            type="checkbox"
                            id="one-time"
                            checked={isOneTime}
                            onChange={(e) => setIsOneTime(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black"
                        />
                        <label htmlFor="one-time" className="text-xs font-bold text-zinc-500 cursor-pointer select-none">
                            Burn after read (One-time link)
                        </label>
                    </div>
                </div>

                {error && <p className="text-black text-xs font-bold px-1 text-center bg-zinc-100 py-2 rounded-lg">{error}</p>}
            </form>
        </div>
    );
};

export default ShortenForm;
