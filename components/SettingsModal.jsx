"use client";
import React, { useState } from 'react';
import { X, Save, Shield, Calendar, Power, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const SettingsModal = ({ isOpen, onClose, url, onUpdate }) => {
    const [formData, setFormData] = useState({
        isActive: url?.isActive ?? true,
        password: url?.password || '',
        expiresAt: url?.expiresAt ? new Date(url.expiresAt).toISOString().split('T')[0] : ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put(`/url/${url._id}`, formData);
            onUpdate(data.data);
            onClose();
        } catch (err) {
            alert('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tight">LINK CONTROL.</h2>
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Configuring {url.shortCode}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${formData.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                <Power className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">Active Status</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase">Toggle link availability</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={`w-14 h-8 rounded-full transition-all relative ${formData.isActive ? 'bg-black' : 'bg-zinc-200'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${formData.isActive ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Password Protection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">Protection</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase">Require password</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Set access pin (optional)"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-black transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* Expiration */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">Expiration</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase">Auto-deactivate date</p>
                            </div>
                        </div>
                        <input
                            type="date"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-black transition-all"
                            value={formData.expiresAt}
                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all text-xs uppercase"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                <Save className="w-4 h-4" />
                                Apply Parameters
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
