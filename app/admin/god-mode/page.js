"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Shield, Users, Link2, DollarSign, Activity, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GodModePage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data.data);
            } catch (err) {
                console.error("Access Denied", err);
                setError("Access Restricted. Redirecting...");
                setTimeout(() => router.push('/dashboard'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Shield className="w-12 h-12 text-zinc-500 animate-pulse" />
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Verifying Clearance...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-red-500 font-black text-xl uppercase tracking-widest">Unauthorized Access</h1>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-16 border-b border-zinc-800 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Zap className="w-6 h-6 text-black fill-black" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-widest">God Mode</h1>
                            <p className="text-zinc-500 text-xs font-mono">System Administrator Console</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-500 uppercase">System Operational</span>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard 
                        label="Total Users" 
                        value={stats.users.total} 
                        icon={<Users className="w-5 h-5" />} 
                        subtext={`${stats.users.distribution?.pro + stats.users.distribution?.business} Premium`}
                    />
                    <StatCard 
                        label="Total Links" 
                        value={stats.links} 
                        icon={<Link2 className="w-5 h-5" />} 
                        color="indigo"
                    />
                    <StatCard 
                        label="Global Clicks" 
                        value={stats.clicks} 
                        icon={<Activity className="w-5 h-5" />} 
                        color="emerald"
                    />
                    <StatCard 
                        label="Est. Revenue" 
                        value={`₹${stats.revenue.toLocaleString()}`} 
                        icon={<DollarSign className="w-5 h-5" />} 
                        color="amber"
                        isMoney
                    />
                </div>

                {/* Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Distribution */}
                    <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-zinc-400">Plan Distribution</h3>
                        <div className="space-y-6">
                            <DistributionItem label="Free (Spark)" value={stats.users.distribution?.free} total={stats.users.total} color="zinc" />
                            <DistributionItem label="Growth (Starter)" value={stats.users.distribution?.starter} total={stats.users.total} color="emerald" />
                            <DistributionItem label="Elite (Pro)" value={stats.users.distribution?.pro} total={stats.users.total} color="indigo" />
                            <DistributionItem label="Scale (Business)" value={stats.users.distribution?.business} total={stats.users.total} color="amber" />
                        </div>
                    </div>

                    {/* Recent Signups */}
                    <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                         <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-zinc-400">Recent Signups</h3>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                                        <th className="pb-4">User</th>
                                        <th className="pb-4">Plan</th>
                                        <th className="pb-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-mono text-zinc-300">
                                    {stats.recentUsers.map((user, i) => (
                                        <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/50 transition-colors">
                                            <td className="py-4 font-medium text-white">
                                                {user.firstName} {user.lastName}
                                                <div className="text-xs text-zinc-500">{user.email}</div>
                                            </td>
                                            <td className="py-4">
                                                <Badge plan={user.plan} />
                                            </td>
                                            <td className="py-4 text-zinc-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, icon, subtext, color = "zinc", isMoney }) => (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition-colors group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-${color}-500 group-hover:text-white transition-colors`}>
                {icon}
            </div>
            {isMoney && <span className="text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 px-2 py-1 rounded">MRR</span>}
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
        <p className="text-3xl font-black font-mono text-white">{value}</p>
        {subtext && <p className="text-xs font-mono text-zinc-500 mt-2">{subtext}</p>}
    </div>
);

const DistributionItem = ({ label, value, total, color }) => (
    <div>
        <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-zinc-400">{label}</span>
            <span className="text-white">{value}</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(value / total) * 100}%` }}
                className={`h-full bg-${color}-500`}
            />
        </div>
    </div>
);

const Badge = ({ plan }) => {
    const colors = {
        free: "bg-zinc-800 text-zinc-400",
        starter: "bg-emerald-900/30 text-emerald-400 border border-emerald-900",
        pro: "bg-indigo-900/30 text-indigo-400 border border-indigo-900",
        business: "bg-amber-900/30 text-amber-400 border border-amber-900"
    };
    return (
        <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ${colors[plan] || colors.free}`}>
            {plan}
        </span>
    );
};
