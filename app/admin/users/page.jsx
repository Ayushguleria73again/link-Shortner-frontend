"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Shield, Users, Mail, Phone, Calendar, Search, Filter, ArrowLeft, ChevronRight, Zap, MoreVertical, LogIn, Ban, Crown, RefreshCcw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState('all');
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data.data);
        } catch (err) {
            setError(err.response?.data?.error || "Unauthorized access.");
            setTimeout(() => router.push('/dashboard'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlan = async (userId, plan) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}/plan`, { plan });
            toast.success(data.message);
            fetchUsers();
            setActionMenuOpen(null);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update plan.");
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}/status`);
            toast.success(data.message);
            fetchUsers();
            setActionMenuOpen(null);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to toggle status.");
        }
    };

    const handleImpersonate = async (userId) => {
        try {
            const { data } = await api.post(`/admin/users/${userId}/impersonate`);
            localStorage.setItem('token', data.token);
            toast.success("Impersonation Handshake Complete. Redirecting...");
            setTimeout(() => window.location.href = '/dashboard', 1000);
        } catch (err) {
            toast.error(err.response?.data?.error || "Impersonation failed.");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterPlan === 'all' || user.plan === filterPlan;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Shield className="w-12 h-12 text-zinc-500 animate-pulse" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono text-xs uppercase tracking-widest">
            {error}
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
                            <h1 className="text-2xl font-black uppercase tracking-widest">User Intelligence</h1>
                            <p className="text-zinc-500 text-xs font-mono">Registry of all terminal operators</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search email or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-xs font-bold focus:outline-none focus:border-zinc-500 transition-all w-[300px]"
                            />
                        </div>

                        <div className="flex items-center bg-zinc-900 rounded-2xl p-1 border border-zinc-800">
                            {['all', 'free', 'starter', 'pro', 'business'].map((plan) => (
                                <button 
                                    key={plan}
                                    onClick={() => setFilterPlan(plan)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterPlan === plan ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    {plan}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Users Table */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/30">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Operator</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status & Plan</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Telemetry</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Joined</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-black uppercase border ${user.status === 'suspended' ? 'border-red-500/50 text-red-500' : 'border-zinc-700'}`}>
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                                        {user.firstName} {user.lastName}
                                                        {user.status === 'suspended' && <span className="bg-red-500/10 text-red-500 text-[8px] px-1.5 py-0.5 rounded border border-red-500/20">SUSPENDED</span>}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-mono lowercase flex items-center gap-1.5 mt-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-2">
                                                <Badge plan={user.plan} />
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1 h-1 rounded-full ${user.acceptedTerms ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                        {user.acceptedTerms ? 'Compliant' : 'Non-Compliant'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white font-mono">{user.usage?.linksCreated || 0}</span>
                                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Links</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white font-mono">{user.usage?.clicksRecorded || 0}</span>
                                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Hits</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-zinc-400 font-mono text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                                                {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'No Date'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right relative">
                                            <button 
                                                onClick={() => setActionMenuOpen(actionMenuOpen === user._id ? null : user._id)}
                                                className="w-10 h-10 rounded-full hover:bg-zinc-800 flex items-center justify-center transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5 text-zinc-500 hover:text-white" />
                                            </button>

                                            <AnimatePresence>
                                                {actionMenuOpen === user._id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpen(null)} />
                                                        <motion.div 
                                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            className="absolute right-8 top-20 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden"
                                                        >
                                                            <div className="p-2 space-y-1">
                                                                <p className="px-3 py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50 mb-1">Oversight Actions</p>
                                                                
                                                                <button 
                                                                    onClick={() => handleImpersonate(user._id)}
                                                                    className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase transition-colors hover:bg-zinc-800 flex items-center gap-3 text-emerald-400"
                                                                >
                                                                    <LogIn className="w-3.5 h-3.5" />
                                                                    Impulse Login
                                                                </button>

                                                                <div className="border-t border-zinc-800/50 my-1 pt-1" />
                                                                <p className="px-3 py-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">Tier Override</p>
                                                                {['free', 'starter', 'pro', 'business'].map(p => (
                                                                    <button 
                                                                        key={p}
                                                                        onClick={() => handleUpdatePlan(user._id, p)}
                                                                        className={`w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase transition-colors hover:bg-zinc-800 flex items-center gap-3 ${user.plan === p ? 'text-white' : 'text-zinc-500'}`}
                                                                    >
                                                                        <Crown className={`w-3.5 h-3.5 ${user.plan === p ? 'text-amber-500' : 'text-zinc-700'}`} />
                                                                        {p}
                                                                    </button>
                                                                ))}

                                                                <div className="border-t border-zinc-800/50 my-1 pt-1" />
                                                                <button 
                                                                    onClick={() => handleToggleStatus(user._id)}
                                                                    className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase transition-colors hover:bg-zinc-800 flex items-center gap-3 ${user.status === 'suspended' ? 'text-emerald-400' : 'text-red-500'}`}
                                                                >
                                                                    {user.status === 'suspended' ? (
                                                                        <>
                                                                            <RefreshCcw className="w-3.5 h-3.5" />
                                                                            Reactivate
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Ban className="w-3.5 h-3.5" />
                                                                            Suspend User
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-24 text-center">
                                            <Zap className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                                            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">No operators found in sector</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Badge = ({ plan }) => {
    const colors = {
        free: "bg-zinc-800 text-zinc-400 border-zinc-700",
        starter: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        pro: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        business: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    };
    return (
        <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-black tracking-[0.1em] w-fit ${colors[plan] || colors.free}`}>
            {plan}
        </span>
    );
};
