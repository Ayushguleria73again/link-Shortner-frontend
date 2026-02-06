"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Shield, Mail, Send, Download, Search, Filter, ArrowLeft, ChevronRight, Zap, CheckCircle, XCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [broadcastData, setBroadcastData] = useState({ subject: '', message: '', isTest: true });
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const { data } = await api.get('/admin/newsletter/subscribers');
            setSubscribers(data.data);
        } catch (err) {
            toast.error(err.response?.data?.error || "Unauthorized access.");
            setTimeout(() => router.push('/dashboard'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const { data } = await api.post('/admin/newsletter/broadcast', broadcastData);
            toast.success(data.message);
            if (!broadcastData.isTest) {
                setIsBroadcastModalOpen(false);
                setBroadcastData({ subject: '', message: '', isTest: true });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Broadcast failed.");
        } finally {
            setIsSending(false);
        }
    };

    const exportToCSV = () => {
        const headers = ["Email", "Status", "Joined", "User ID"];
        const rows = subscribers.map(sub => [
            sub.email,
            sub.isActive ? "Active" : "Inactive",
            format(new Date(sub.createdAt), 'yyyy-MM-dd'),
            sub.userId || "Anonymous"
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `newsletter_subscribers_${format(new Date(), 'yyyyMMdd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSubscribers = subscribers.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Shield className="w-12 h-12 text-zinc-500 animate-pulse" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-zinc-800 pb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/god-mode" className="w-12 h-12 bg-white rounded-full flex items-center justify-center group hover:scale-110 transition-transform">
                            <ArrowLeft className="w-6 h-6 text-black" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-widest">Signal Stream</h1>
                            <p className="text-zinc-500 text-xs font-mono">Newsletter Registry & Broadcast Protocol</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <button 
                            onClick={() => setIsBroadcastModalOpen(true)}
                            className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Send className="w-3 h-3" />
                            New Broadcast
                        </button>
                        <button 
                            onClick={exportToCSV}
                            className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-zinc-600 transition-all"
                        >
                            <Download className="w-3 h-3 text-zinc-500" />
                            Export CSV
                        </button>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px]">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Signals</p>
                        <p className="text-3xl font-black font-mono">{subscribers.length}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px]">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Active Stream</p>
                        <p className="text-3xl font-black font-mono text-emerald-500">{subscribers.filter(s => s.isActive).length}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px]">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Internal Users</p>
                        <p className="text-3xl font-black font-mono text-indigo-500">{subscribers.filter(s => s.userId).length}</p>
                    </div>
                </div>

                {/* Sub Registry */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Subscriber Registry</h3>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black border border-zinc-800 rounded-xl pl-12 pr-6 py-2 text-[10px] font-bold focus:outline-none focus:border-zinc-500 transition-all w-[240px]"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                                    <th className="px-8 py-5">Signal (Email)</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Origin Type</th>
                                    <th className="px-8 py-5">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50 text-sm font-mono">
                                {filteredSubscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-8 py-6 text-white">{sub.email}</td>
                                        <td className="px-8 py-6">
                                            {sub.isActive ? (
                                                <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                                                    <XCircle className="w-3 h-3" /> Silent
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${sub.userId ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                                                {sub.userId ? 'Registered User' : 'Anonymous'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-zinc-500 italic">
                                            {format(new Date(sub.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Broadcast Modal */}
            <AnimatePresence>
                {isBroadcastModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSending && setIsBroadcastModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl shadow-white/5"
                        >
                            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-widest text-white">Draft Broadcast</h2>
                                    <p className="text-zinc-500 text-[10px] font-mono mt-1 uppercase">Relaying signal to {subscribers.filter(s => s.isActive).length} active nodes</p>
                                </div>
                                <button 
                                    onClick={() => setIsBroadcastModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                                >
                                    <XCircle className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <form onSubmit={handleBroadcast} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Subject Protocol</label>
                                    <input 
                                        required
                                        type="text"
                                        placeholder="Intelligence Update..."
                                        value={broadcastData.subject}
                                        onChange={(e) => setBroadcastData({...broadcastData, subject: e.target.value})}
                                        className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-zinc-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Signal Payload (HTML Supported)</label>
                                    <textarea 
                                        required
                                        rows={10}
                                        placeholder="<p>Welcome to the stream...</p>"
                                        value={broadcastData.message}
                                        onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                                        className="w-full bg-black border border-zinc-800 rounded-3xl px-6 py-6 font-mono text-sm text-white focus:outline-none focus:border-zinc-500 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${broadcastData.isTest ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white">Test Handshake</p>
                                            <p className="text-[9px] text-zinc-500 font-mono uppercase">Send only to admin console first</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setBroadcastData({...broadcastData, isTest: !broadcastData.isTest})}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${broadcastData.isTest ? 'bg-amber-500' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${broadcastData.isTest ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isSending}
                                        className={`flex-grow py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 ${broadcastData.isTest ? 'bg-zinc-100 text-black hover:bg-white' : 'bg-red-600 text-white hover:bg-red-500'}`}
                                    >
                                        {isSending ? (
                                            <Zap className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {broadcastData.isTest ? 'Run Test Sequence' : 'Initiate Global Broadcast'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
