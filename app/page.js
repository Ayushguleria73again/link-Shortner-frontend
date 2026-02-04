"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MatrixRain from '@/components/MatrixRain';
import { 
  ArrowRight, Link2, BarChart2, Shield, Zap, 
  Globe, Activity, MousePointer2, Users, ChevronRight
} from 'lucide-react';
import PricingSection from '@/components/PricingSection';

const ScrambleText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = React.useState('');
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_!@#$%^&*()';
  
  React.useEffect(() => {
    let timeout;
    let iteration = 0;
    const totalIterations = 15;
    
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(prev => {
          return text.split('').map((char, index) => {
            if (char === ' ' || char === '.' || char === '\n') return char;
            if (index < iteration / (totalIterations / text.length)) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          }).join('');
        });

        iteration++;
        if (iteration >= totalIterations * 2) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return <span>{displayText || ' '}</span>;
};

const AnimatedCounter = ({ value, duration = 2000, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const target = parseFloat(value);
  
  React.useEffect(() => {
    let start = 0;
    const end = target;
    const range = end - start;
    let current = start;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  // Subtle live fluctuation simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setCount(prev => prev + (Math.random() * 0.1));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return <span>{count.toLocaleString(undefined, { maximumFractionDigits: 1 })}{suffix}</span>;
};

import api from '@/lib/api';

export default function Home() {
  const [stats, setStats] = React.useState({ totalClicks: 0, totalUniqueClicks: 0, totalMarkets: 0 });
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  React.useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const { data } = await api.get('/analytics/public/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Error fetching global stats:', err);
      }
    };
    fetchGlobalStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white">
      <MatrixRain />
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-40" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 text-[10px] font-black tracking-[0.2em] text-zinc-400 mb-10 uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Elite Analytics Suite 2.0 Now Live
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-7xl md:text-[10rem] font-black tracking-[-0.04em] leading-[0.85] text-black mb-12"
            >
              <ScrambleText text="LESS LINK." delay={400} /><br />
              <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent font-mono">
                <ScrambleText text="MORE DATA." delay={1000} />
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
            >
              The professional-grade link shortener with real-time audience intelligence, 
              city-level tracking, and automated reporting.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                href={isLoggedIn ? "/dashboard" : "/signup"} 
                className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 group"
              >
                {isLoggedIn ? "GO TO DASHBOARD" : "CREATE ELITE LINK"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href={isLoggedIn ? "/dashboard" : "/login"} 
                className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black text-xs tracking-[0.2em] border-2 border-zinc-100 hover:border-black transition-all flex items-center justify-center gap-2"
              >
                {isLoggedIn ? "VIEW ANALYTICS" : "ACCESS CONSOLE"}
              </Link>
            </motion.div>

            {/* Preview Box */}
            <motion.div 
              variants={itemVariants}
              className="mt-32 w-full max-w-5xl bg-white border border-zinc-100 rounded-[40px] shadow-2xl shadow-zinc-200/50 p-4 md:p-8 relative"
            >
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                 Live Insight Engine
               </div>
               <div className="bg-zinc-50 rounded-[32px] overflow-hidden">
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <PreviewStat label="Total Hits" value={<AnimatedCounter value={stats.totalClicks} />} icon={<MousePointer2 className="w-4 h-4" />} />
                     <PreviewStat label="Unique Reach" value={<AnimatedCounter value={stats.totalUniqueClicks} />} icon={<Users className="w-4 h-4" />} />
                     <PreviewStat label="Markets" value={<AnimatedCounter value={stats.totalMarkets} />} icon={<Globe className="w-4 h-4" />} />
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-indigo-500" />}
              title="Instant Routing"
              text="Global edge network ensures < 30ms redirection speed to any destination."
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-emerald-500" />}
              title="Elite Intelligence"
              text="Deep metrics: City-level data, device tracking, and referrer paths."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-rose-500" />}
              title="Enterprise Armor"
              text="Password protection, link expiration, and brute-force protection out of the box."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Target Protocols.</h2>
            <p className="text-zinc-500 font-medium">Engineered for high-velocity signal transmission.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard 
              category="Creators"
              title="Audience Intelligence"
              description="Track fan engagement across platforms. Know exactly which content drives traffic."
              color="indigo"
            />
            <UseCaseCard 
              category="Brands"
              title="Campaign Attribution"
              description="Measure ROI with precision. Retarget users who clicked but didn't convert."
              color="emerald"
            />
            <UseCaseCard 
              category="Developers"
              title="API & Webhooks"
              description="Integrate short links programmatically. Webhooks for real-time click events."
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">System FAQs.</h2>
            <p className="text-zinc-500 font-medium">Common queries regarding the protocol.</p>
          </div>
          <div className="space-y-4">
            <FAQItem 
              question="Does the free plan expire?" 
              answer="No. The Spark plan is free forever. You get 50 active links and 1,000 monthly clicks with no credit card required." 
            />
            <FAQItem 
              question="Can I use my own domain?" 
              answer="Yes. Custom domains are available on Growth, Elite, and Scale plans. Verification is instant via DNS." 
            />
            <FAQItem 
              question="What happens if I exceed my click limit?" 
              answer="Your links will continue to work. We never break your redirects. You'll just lose access to analytics until the next cycle or upgrade." 
            />
            <FAQItem 
              question="Is data GDPR compliant?" 
              answer="Absolutely. We anonymize IP addresses and offer a strict 'Burn-on-Read' protocol for sensitive data." 
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Final CTA */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto bg-black rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
           
           <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 relative z-10">
             Ready for elite scale?
           </h2>
           <Link 
              href={isLoggedIn ? "/dashboard" : "/signup"} 
              className="inline-flex items-center gap-3 bg-white text-black px-12 py-6 rounded-3xl font-black text-xs tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all relative z-10 shadow-lg"
            >
              {isLoggedIn ? "Go to Dashboard" : "Sign up for free"}
              <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
      </section>

    </div>
  );
}

function PreviewStat({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-zinc-300">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
      </div>
      <p className="text-3xl font-black tracking-tighter text-black font-mono">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-zinc-50/50 p-12 rounded-[40px] border border-zinc-100 hover:border-zinc-200 transition-all group">
      <div className="mb-8 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight mb-4 uppercase">{title}</h3>
      <p className="text-zinc-500 font-medium text-sm leading-relaxed">{text}</p>
    </div>
  );
}
const UseCaseCard = ({ category, title, description, color = "indigo" }) => (
  <div className={`bg-white p-8 rounded-[32px] border border-zinc-100 hover:shadow-xl hover:shadow-${color}-500/10 transition-all group hover:-translate-y-1`}>
    <div className={`inline-block px-3 py-1 rounded-full bg-${color}-50 text-[10px] font-black uppercase tracking-widest text-${color}-600 mb-6 group-hover:bg-${color}-500 group-hover:text-white transition-colors`}>
      {category}
    </div>
    <h3 className="text-xl font-black mb-3">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-zinc-50 border border-zinc-100 rounded-2xl p-6 cursor-pointer hover:bg-white hover:shadow-md transition-all group ${isOpen ? 'bg-white shadow-md border-indigo-100' : ''}`}
    >
      <div className="flex items-center justify-between">
        <h4 className={`font-bold text-sm transition-colors ${isOpen ? 'text-indigo-600' : 'text-zinc-900 group-hover:text-black'}`}>{question}</h4>
        <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-90 text-indigo-500' : 'group-hover:text-black'}`} />
      </div>
      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};
