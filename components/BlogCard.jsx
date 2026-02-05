"use client";
import React from 'react';
import Link from 'next/link';
import { Calendar, User, MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const BlogCard = ({ post }) => {
    return (
        <Link href={`/blog/${post.slug}`} className="group h-full">
            <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 group">
                {/* Image Placeholder with Branded Gradient */}
                <div className="aspect-video relative overflow-hidden bg-zinc-50 italic">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-200 group-hover:tracking-[0.5em] transition-all duration-700">Intel Signal</span>
                    </div>
                    {/* Floating Bits Decor */}
                    <div className="absolute top-4 left-6 text-[8px] font-mono text-indigo-200 opacity-40">010110</div>
                    <div className="absolute bottom-4 right-6 text-[8px] font-mono text-emerald-200 opacity-40">SIGNAL_ACTIVE</div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        {post.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-400">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-xl font-black text-zinc-900 group-hover:text-indigo-600 transition-colors mb-3 leading-tight">
                        {post.title}
                    </h3>

                    <p className="text-sm text-zinc-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-400">
                                <Heart className="w-3 h-3 text-rose-500" />
                                {post.likes?.length || 0}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-400">
                                <MessageSquare className="w-3 h-3 text-indigo-500" />
                                {post.comments?.length || 0}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500 group-hover:translate-x-1 transition-transform">
                            Read Report
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
