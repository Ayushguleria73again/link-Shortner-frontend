"use client";
import React, { useState, useEffect } from 'react';
import { Newspaper, Search, Filter, Loader2, Sparkles, Database } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import MouseFollower from '@/components/MouseFollower';
import HeroSignalRain from '@/components/HeroSignalRain';
import api from '@/lib/api';

export default function BlogListing() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get('/blog');
                setPosts(data.data);
            } catch (err) {
                console.error('Failed to load intel signals:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-white pb-32">
            <MouseFollower />
            
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <HeroSignalRain />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-10">
                        <Database className="w-3 h-3 text-indigo-500" />
                        Intelligence Stream
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-black tracking-tight mb-8">
                        INTEL <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent font-mono">FEED.</span>
                    </h1>
                    <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                        Decrypting the future of signal management and marketing engineering.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-[40px] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search signals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-zinc-100 rounded-[24px] py-6 pl-14 pr-6 text-black placeholder:text-zinc-300 focus:outline-none focus:border-black focus:ring-4 focus:ring-zinc-100 transition-all font-bold text-sm shadow-2xl shadow-zinc-200/30"
                        />
                    </div>
                </div>
            </section>

            {/* Feed Section */}
            <section className="max-w-7xl mx-auto py-24 px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Decrypting Feed...</p>
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <BlogCard key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-zinc-100 rounded-[40px] bg-zinc-50/30">
                        <Sparkles className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-zinc-900 mb-2">Signal Lost.</h3>
                        <p className="text-sm text-zinc-500 font-medium">No intelligence reports match your search criteria.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
