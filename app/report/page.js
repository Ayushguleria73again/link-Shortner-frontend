"use client";
import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Send, AlertCircle, CheckCircle2, X, UploadCloud } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function ReportBug() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Bug');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Photo must be less than 5MB");
                return;
            }
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        if (photo) formData.append('photo', photo);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/reports`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSubmitted(true);
            toast.success("Details received. Our team is investigating.");
        } catch (err) {
            console.error('Report submission error:', err);
            toast.error(err.response?.data?.error || "Shield Alert: Connection failed");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center p-6">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-indigo-500/5 items-center">
                        <CheckCircle2 className="w-12 h-12 text-indigo-500" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Report Received.</h1>
                    <p className="text-zinc-500 font-medium">Your report has been received. Our team will review the details and resolve the issue shortly.</p>
                    <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all"
                    >
                        Return to Command Center
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black tracking-widest uppercase mb-4">
                        <AlertCircle className="w-3 h-3" />
                        Bug Report
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Report an <span className="text-zinc-400">Issue.</span></h1>
                    <p className="text-zinc-500 font-medium max-w-2xl">Found a problem with the platform? Submit details and photos below to help us improve the system.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Subject Line</label>
                            <input 
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Short description of the issue"
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-[24px] px-6 py-4 outline-none focus:ring-2 ring-black/5 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-[24px] px-6 py-4 outline-none focus:ring-2 ring-black/5 transition-all text-sm font-bold appearance-none cursor-pointer"
                            >
                                <option>Bug</option>
                                <option>UI Glitch</option>
                                <option>Feature Request</option>
                                <option>Security</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Detailed Description</label>
                        <textarea 
                            required
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What happened? How can we reproduce it?"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-[32px] px-6 py-6 outline-none focus:ring-2 ring-black/5 transition-all text-sm font-medium resize-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Visual Evidence</label>
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className={`relative border-2 border-dashed rounded-[32px] p-12 transition-all cursor-pointer group flex flex-col items-center justify-center gap-4 ${preview ? 'border-zinc-200 bg-white' : 'border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300'}`}
                        >
                            <input 
                                type="file" 
                                hidden 
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                accept="image/*"
                            />
                            
                            {!preview ? (
                                <>
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-black">Click to upload screenshot</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">PNG, JPG or WEBP max 5MB</p>
                                    </div>
                                </>
                            ) : (
                                <div className="relative group/preview">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="max-h-64 rounded-2xl shadow-2xl ring-1 ring-black/5" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                                        className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className={`w-full bg-black text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Transmit Intelligence
                    </button>
                </form>
            </div>
        </div>
    );
}
