"use client";
import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area, Defs, LinearGradient, Stop
} from 'recharts';

const AnalyticsChart = ({ data, title, type = "line" }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-48 flex items-center justify-center text-zinc-300 border border-zinc-100 rounded-3xl font-bold text-xs tracking-widest uppercase bg-zinc-50/50">
                No Data Points Found
            </div>
        );
    }

    // Vibrant, friendly color palette
    const COLORS = {
        indigo: '#6366f1',
        emerald: '#10b981',
        amber: '#f59e0b',
        rose: '#f43f5e',
        sky: '#0ea5e9',
        violet: '#8b5cf6'
    };

    const PIE_COLORS = [COLORS.indigo, COLORS.emerald, COLORS.amber, COLORS.rose, COLORS.sky];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-xl border border-zinc-100 rounded-2xl flex flex-col gap-1 ring-4 ring-black/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label || title}</p>
                    <p className="text-lg font-black text-black">
                        {payload[0].value} <span className="text-sm font-medium text-zinc-400">Hits</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow h-full">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                {title}
            </h3>
            <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'line' ? (
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} tickMargin={12} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} tickMargin={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="clicks"
                                stroke={COLORS.indigo}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorClicks)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    ) : type === 'bar' ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} tickMargin={12} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} tickMargin={12} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                                animationDuration={1500}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;
