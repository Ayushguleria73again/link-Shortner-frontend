"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Shield, Users, Mail, Phone, Calendar, Search, Filter, ArrowLeft, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState('all');
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
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
        fetchUsers();
    }, [router]);

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
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Identifier</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-black uppercase border border-zinc-700">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white uppercase tracking-tight">{user.firstName} {user.lastName}</div>
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
                                                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="text-[10px] font-mono text-zinc-600 uppercase">
                                                {user.phoneNumber || 'No Signal'}
                                            </div>
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
