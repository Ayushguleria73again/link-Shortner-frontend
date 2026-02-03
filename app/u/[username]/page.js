"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import MatrixRain from '@/components/MatrixRain';
import { Link2, Twitter, Github, Linkedin, Instagram, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const res = await axios.get(`${backendUrl}/profile/${username}`);
        setData(res.data.data);
      } catch (err) {
        setError("User profile not located in the database.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-4xl font-black mb-4">404_NOT_FOUND</h1>
        <p className="text-zinc-400 font-mono italic uppercase text-xs tracking-widest">{error || "Profile offline."}</p>
      </div>
    </div>
  );

  const { profile, links } = data;

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white relative overflow-hidden">
      <MatrixRain />
      
      <div className="max-w-2xl mx-auto px-6 py-24 relative z-10 flex flex-col items-center">
        {/* Avatar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-zinc-100 rounded-[48px] mb-8 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center"
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl font-black text-zinc-300">{profile.username[0].toUpperCase()}</div>
          )}
        </motion.div>

        {/* Bio */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-black tracking-tight">{profile.displayName || profile.username}</h1>
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-zinc-500 font-medium mb-6">{profile.bio || "Secure digital identity verified."}</p>
          
          <div className="flex gap-4 justify-center">
            {profile.socialLinks?.twitter && <SocialIcon href={profile.socialLinks.twitter} icon={<Twitter />} />}
            {profile.socialLinks?.github && <SocialIcon href={profile.socialLinks.github} icon={<Github />} />}
            {profile.socialLinks?.linkedin && <SocialIcon href={profile.socialLinks.linkedin} icon={<Linkedin />} />}
            {profile.socialLinks?.instagram && <SocialIcon href={profile.socialLinks.instagram} icon={<Instagram />} />}
          </div>
        </motion.div>

        {/* Links */}
        <div className="w-full space-y-4">
          {links.map((link, i) => (
            <motion.a
              key={link.shortCode}
              href={`/${link.shortCode}`}
              target="_blank"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group block w-full bg-white border border-zinc-100 p-6 rounded-[32px] hover:border-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-100/50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                     <Link2 className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="font-bold text-sm text-zinc-800 break-all">{link.title}</div>
                     <div className="text-[10px] font-black font-mono text-zinc-400 uppercase tracking-widest mt-1">
                       {link.totalClicks} ANALYTICS LOGGED
                     </div>
                   </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
              </div>
              
              {/* Subtle hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>

        {/* Branding */}
        <div className="mt-24 text-center">
           <div className="flex items-center gap-2 font-black tracking-tighter text-xl mb-2 opacity-20">
             <Link2 className="w-5 h-5" />
             SHORTY.
           </div>
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">
             Engineered by Shorty Elite Intelligence.
           </p>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="p-3 bg-zinc-50 rounded-2xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all active:scale-90"
    >
      {React.cloneElement(icon, { size: 18 })}
    </a>
  );
}
