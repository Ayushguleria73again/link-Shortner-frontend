import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Globe, Plus, Loader2, Check, AlertCircle, Trash2, RefreshCcw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function DomainManager({ userPlan }) {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDomain, setNewDomain] = useState('');
    const [adding, setAdding] = useState(false);
    const [verifying, setVerifying] = useState(null);

    const PLAN_LIMITS = {
        free: 0,
        starter: 1,
        pro: 5,
        business: 20
    };

    const limit = PLAN_LIMITS[userPlan] || 0;
    const canAdd = domains.length < limit;

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/domains');
            setDomains(data.data);
        } catch (err) {
            console.error('Error fetching domains:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        if (!newDomain) return;

        try {
            setAdding(true);
            const { data } = await api.post('/domains', { domain: newDomain });
            setDomains([data.data, ...domains]);
            setNewDomain('');
            toast.success('Domain registered. Please configure DNS.');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add domain');
        } finally {
            setAdding(false);
        }
    };

    const handleVerify = async (id) => {
        try {
            setVerifying(id);
            const { data } = await api.post(`/domains/${id}/verify`);
            setDomains(domains.map(d => d._id === id ? data.data : d));
            toast.success('Domain verified successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Verification failed');
        } finally {
            setVerifying(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will break any links using this domain.')) return;
        try {
            await api.delete(`/domains/${id}`);
            setDomains(domains.filter(d => d._id !== id));
            toast.success('Domain removed.');
        } catch (err) {
            toast.error('Failed to remove domain');
        }
    };

    if (loading) return <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></div>;

    return (
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em]">Custom Domains</h2>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full text-zinc-500">
                    {domains.length} / {limit} Using
                </div>
            </div>

            <div className="relative">
                {/* Elite Gate for Free Tier */}
                {userPlan === 'free' && (
                    <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-zinc-200">
                        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-3 shadow-xl">
                            <Globe className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-black mb-1">Custom Domains</h3>
                        <p className="text-[10px] text-zinc-500 font-medium max-w-[200px] mb-4 text-center">Custom domains are reserved for Growth, Elite, and Scale protocols.</p>
                        <button
                            onClick={() => window.location.href = '/pricing'}
                            className="bg-zinc-950 text-white px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            Upgrade Protocol
                        </button>
                    </div>
                )}

                {/* Add Domain Form */}
                <form onSubmit={handleAddDomain} className="mb-8">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">https://</span>
                            <input
                                type="text"
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                placeholder="links.yourbrand.com"
                                className="w-full pl-20 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                disabled={!canAdd}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={adding || !newDomain || !canAdd}
                            className="bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Add
                        </button>
                    </div>
                    {!canAdd && (
                        <p className="mt-2 text-[10px] font-bold text-amber-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Plan limit reached. Upgrade to add more domains.
                        </p>
                    )}
                </form>

                {/* Domain List */}
                <div className="space-y-4">
                    {domains.length === 0 ? (
                        <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                            <Globe className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                            <p className="text-xs font-bold text-zinc-400">No custom domains connected.</p>
                        </div>
                    ) : (
                        domains.map(domain => (
                            <div key={domain._id} className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-black text-black flex items-center gap-2">
                                        {domain.domain}
                                        <a href={`https://${domain.domain}`} target="_blank" rel="noreferrer">
                                            <ExternalLink className="w-3 h-3 text-zinc-300 hover:text-black transition-colors" />
                                        </a>
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {domain.verified ? (
                                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">
                                                <Check className="w-3 h-3" /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                                                <AlertCircle className="w-3 h-3" /> Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {!domain.verified && (
                                        <>
                                            <div className="hidden md:block text-right">
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">CNAME Record</p>
                                                <code className="text-[10px] font-mono bg-zinc-100 px-2 py-1 rounded text-zinc-600 block mt-1">
                                                    cname.smol-saas.com
                                                </code>
                                            </div>
                                            <button
                                                onClick={() => handleVerify(domain._id)}
                                                disabled={verifying === domain._id}
                                                className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                                            >
                                                {verifying === domain._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                                                Verify
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(domain._id)}
                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Remove Domain"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
