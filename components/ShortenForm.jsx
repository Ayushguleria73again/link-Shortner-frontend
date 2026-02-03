"use client";
import React, { useState } from 'react';
import { ArrowRight, LinkIcon, Sparkles, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const ShortenForm = ({ onUrlCreated }) => {
    const [url, setUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/url/shorten', {
                originalUrl: url,
                customAlias: alias
            });
            setUrl('');
            setAlias('');
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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-12 lg:col-span-6 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Original URL</label>
                        <div className="relative">
                            <input
                                id="url-input"
                                type="url"
                                required
                                placeholder="https://example.com/very-long-path"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black placeholder:text-zinc-300 focus:outline-none focus:border-black transition-all font-medium"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-12 lg:col-span-4 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Custom Alias (Optional)</label>
                        <input
                            type="text"
                            placeholder="alias"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-black placeholder:text-zinc-300 focus:outline-none focus:border-black transition-all font-medium"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-12 lg:col-span-2 flex items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all min-h-[58px]"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'SHORTEN'}
                        </button>
                    </div>
                </div>

                {error && <p className="text-black text-xs font-bold px-1 text-center bg-zinc-100 py-2 rounded-lg">{error}</p>}
            </form>
        </div>
    );
};

export default ShortenForm;
