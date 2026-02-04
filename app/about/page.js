"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        
        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] font-black tracking-[0.2em] mb-8 uppercase">
              Mission Control
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
              We are obsessed with <span className="text-zinc-400">Data.</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed mb-8">
              smol was built for marketers, developers, and creators who demand more than just a redirect. We believe that every click tells a story, and you deserve to read it.
            </p>
          </div>
          <div className="relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
             <div className="bg-zinc-100 rounded-[40px] aspect-square flex items-center justify-center border border-zinc-200">
                {/* Placeholder Image/Art */}
                <span className="text-zinc-300 font-black text-xs uppercase tracking-widest">Team Photo</span>
             </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-zinc-50 rounded-[40px] p-12 md:p-20 border border-zinc-100 text-center">
           <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">The Architect</h2>
           <h3 className="text-4xl font-black tracking-tight mb-6">Ayush Guleria</h3>
           <p className="text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-10">
             Building high-performance web applications with a focus on premium aesthetics and scalable architecture.
           </p>
           <div className="flex justify-center gap-6">
              <SocialLink icon={<Github className="w-5 h-5" />} href="https://github.com" />
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="https://twitter.com" />
              <SocialLink icon={<Linkedin className="w-5 h-5" />} href="https://linkedin.com" />
           </div>
        </div>

      </div>
    </div>
  );
}

function SocialLink({ icon, href }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
    >
      {icon}
    </a>
  );
}
