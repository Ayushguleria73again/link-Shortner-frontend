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

        {/* The Code - Core Values */}
        <div className="mb-32">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-12 text-center">The Code</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ValueCard 
                    title="Speed" 
                    desc="Latency is the enemy. Our edge network ensures your links resolve in milliseconds, globally."
                    icon={<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                />
                <ValueCard 
                    title="Privacy" 
                    desc="Your data is yours. We encrypt sensitive metrics and never sell user profiles to third parties."
                    icon={<div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                />
                <ValueCard 
                    title="Aesthetics" 
                    desc="Ugly tools kill creativity. We build interfaces that inspire you to create your best work."
                    icon={<div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                />
            </div>
        </div>

        {/* System Architecture */}
        <div className="mb-32 bg-black text-white rounded-[40px] p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">System Architecture</h2>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-12 max-w-2xl">
                    Built on the bleeding edge of <span className="text-zinc-500">Serverless Technology.</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <TechItem name="Next.js 14" label="Frontend Core" />
                    <TechItem name="Node.js" label="Serverless Runtime" />
                    <TechItem name="MongoDB" label="Global Data Layer" />
                    <TechItem name="Redis" label="Edge Caching" />
                </div>
            </div>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]" />
        </div>

         {/* Global Footprint */}
         <div className="mb-32 text-center">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-16">Global Footprint</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <MetricItem value="99.9%" label="Uptime Guarantee" />
                 <MetricItem value="50ms" label="Avg. Latency" />
                 <MetricItem value="150+" label="Countries Reached" />
             </div>
         </div>

        {/* Join CTA */}
        <div className="text-center bg-indigo-600 rounded-[40px] p-20 relative overflow-hidden">
             <div className="relative z-10">
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8">Ready to break the simulation?</h2>
                 <Link 
                    href="/signup"
                    className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-100 transition-all active:scale-95"
                 >
                    Join the Revolution
                 </Link>
             </div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
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

function ValueCard({ title, desc, icon }) {
    return (
        <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h3 className="text-lg font-black uppercase tracking-tight">{title}</h3>
            </div>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-600">
                {desc}
            </p>
        </div>
    );
}

function TechItem({ name, label }) {
    return (
        <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</div>
            <div className="text-lg font-bold text-white">{name}</div>
        </div>
    );
}

function MetricItem({ value, label }) {
    return (
        <div>
            <div className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-4">{value}</div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{label}</div>
        </div>
    );
}
