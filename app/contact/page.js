"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Mail, Send, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contact', formData);
      toast.success('Message received. We will be in touch shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-100 rounded-2xl mb-6">
            <Mail className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4 text-black">Contact <span className="text-zinc-400">Support.</span></h1>
          <p className="text-zinc-500 font-medium">Need help with your Enterprise plan? Get in touch.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-50 p-8 md:p-12 rounded-[32px] border border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Name</label>
                    <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</label>
                    <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="john@company.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subject</label>
                <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="API Integration Help"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Message</label>
                <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    placeholder="How can we help you scale?"
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Transmission
            </button>
        </form>
      </div>
    </div>
  );
}
