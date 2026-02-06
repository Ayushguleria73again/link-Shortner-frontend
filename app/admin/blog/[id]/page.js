"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { Shield, Send, ArrowLeft, Image as ImageIcon, Tag, Layout, Type, Clock, Save, Zap, Globe, Lock, FileText, Upload, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

export default function BlogEditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        coverImage: 'default-blog.jpg',
        tags: '',
        status: 'published'
    });

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            // Fetch the individual post for editing (this should hit the public or admin GET route)
            const { data } = await api.get(`/blog/${id}`);
            const post = data.data;
            setFormData({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                coverImage: post.coverImage,
                tags: post.tags?.join(', ') || '',
                status: post.status
            });
        } catch (err) {
            toast.error("Failed to load signal data.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const { data } = await api.post('/admin/upload-asset', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, coverImage: data.url });
            toast.success("Photo uploaded to Cloudinary.");
        } catch (err) {
            toast.error("Upload failed. Check signal strength.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        };

        try {
            if (id) {
                await api.put(`/admin/blog/${id}`, payload);
                toast.success("Signal updated successfully.");
            } else {
                await api.post('/admin/blog', payload);
                toast.success("Signal launched into stream.");
            }
            router.push('/admin/blog');
        } catch (err) {
            toast.error(err.response?.data?.error || "Launch sequence failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Shield className="w-12 h-12 text-zinc-500 animate-pulse" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-16 border-b border-zinc-800 pb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/blog" className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center group hover:bg-zinc-800 transition-colors border border-zinc-800">
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-widest">{id ? 'Edit Signal' : 'Launch New Signal'}</h1>
                            <p className="text-zinc-500 text-[10px] font-mono uppercase">Drafting technical intelligence</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none"
                        >
                            <option value="published">Status: Published</option>
                            <option value="draft">Status: Draft</option>
                        </select>
                        <button 
                            onClick={handleSubmit}
                            disabled={saving || uploading}
                            className="bg-white text-black px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {saving ? <Zap className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            {id ? 'Update Registry' : 'Initiate Launch'}
                        </button>
                    </div>
                </header>

                <form className="space-y-8 pb-24">
                    {/* Primary Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                <Type className="w-3 h-3" /> Signal Title
                            </label>
                            <input 
                                required
                                type="text"
                                placeholder="The Future of Link Intelligence..."
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-zinc-500 transition-all text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Metadata Tags (Comma separated)
                            </label>
                            <input 
                                type="text"
                                placeholder="Security, Networking, AI..."
                                value={formData.tags}
                                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 font-mono text-sm text-zinc-400 focus:outline-none focus:border-zinc-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                            <Layout className="w-3 h-3" /> Transmission Excerpt
                        </label>
                        <textarea 
                            rows={2}
                            placeholder="A brief summary for the preview cards..."
                            value={formData.excerpt}
                            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 font-medium text-zinc-300 focus:outline-none focus:border-zinc-500 transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" /> Cover Asset
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="h-48 rounded-[32px] bg-zinc-900/50 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-4 hover:border-zinc-600 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <input 
                                    type="file" 
                                    hidden 
                                    ref={fileInputRef} 
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Zap className="w-8 h-8 text-white animate-spin" />
                                        <p className="text-[10px] font-black uppercase tracking-tighter">Uploading Signal...</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-zinc-600 group-hover:text-white transition-colors" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Select Signal Photo</p>
                                            <p className="text-[9px] text-zinc-600 uppercase mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="h-48 rounded-[32px] bg-zinc-900/50 border border-zinc-800 overflow-hidden flex items-center justify-center relative">
                                {formData.coverImage ? (
                                    <>
                                        <img 
                                            src={formData.coverImage.startsWith('http') ? formData.coverImage : `/images/${formData.coverImage}`} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-4 left-6">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Previewing Asset</p>
                                            <p className="text-[10px] font-mono text-zinc-300 truncate max-w-[200px]">{formData.coverImage}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="w-8 h-8 text-zinc-800 mx-auto mb-2" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">No Asset Captured</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Core Payload (Markdown/HTML)
                        </label>
                        <div className="relative">
                            <textarea 
                                required
                                rows={20}
                                placeholder="Write your signal payload here..."
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[32px] px-8 py-8 font-mono text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
