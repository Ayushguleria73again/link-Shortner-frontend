"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Shield, FileText, Plus, Edit3, Trash2, Eye, MessageSquare, Heart, ArrowLeft, Search, Zap, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/admin/blog');
            setPosts(data.data);
        } catch (err) {
            toast.error("Failed to load blog signals.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to purge this signal from the registry?")) return;
        try {
            await api.delete(`/admin/blog/${postId}`);
            toast.success("Signal purged.");
            fetchPosts();
        } catch (err) {
            toast.error("Purge sequence failed.");
        }
    };

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <h1 className="text-2xl font-black uppercase tracking-widest">Blog CMS</h1>
                            <p className="text-zinc-500 text-xs font-mono">Community Intelligence Management</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-xs font-bold focus:outline-none focus:border-zinc-500 transition-all w-[300px]"
                            />
                        </div>

                        <Link 
                            href="/admin/blog/new"
                            className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Plus className="w-3 h-3" />
                            Launch Signal
                        </Link>
                    </div>
                </header>

                {/* Blog Table */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/30 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                    <th className="px-8 py-6">Signal Title</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6">Engagement</th>
                                    <th className="px-8 py-6">Relayed</th>
                                    <th className="px-8 py-6 text-right">Identifier</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredPosts.map((post) => (
                                    <tr key={post._id} className="hover:bg-zinc-800/20 transition-colors group">
                                        <td className="px-8 py-8">
                                            <div>
                                                <div className="font-bold text-white uppercase tracking-tight line-clamp-1">{post.title}</div>
                                                <div className="text-[10px] text-zinc-500 font-mono mt-1">/blog/{post.slug}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4 text-zinc-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Heart className="w-3.5 h-3.5 text-zinc-600" />
                                                    <span className="text-xs font-mono">{post.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MessageSquare className="w-3.5 h-3.5 text-zinc-600" />
                                                    <span className="text-xs font-mono">{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-zinc-500 font-mono text-[10px]">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-zinc-400" />
                                                </Link>
                                                <Link 
                                                    href={`/admin/blog/edit/${post._id}`}
                                                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4 text-zinc-400" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(post._id)}
                                                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-red-500/20 group/del transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-zinc-400 group-hover/del:text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPosts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-24 text-center">
                                            <FileText className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                                            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">No blog signals in registry</p>
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
