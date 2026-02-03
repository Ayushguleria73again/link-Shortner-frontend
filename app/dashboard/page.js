"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ShortenForm from '@/components/ShortenForm';
import UrlTable from '@/components/UrlTable';
import AnalyticsChart from '@/components/AnalyticsChart';
import { 
  ChevronLeft, Loader2, RefreshCcw, 
  MousePointer2, Globe, Laptop, Smartphone,
  Zap, BarChart3, TrendingUp, Activity,
  Download, ExternalLink, Link2, Users, MapPin, Clock, Radio,
  ArrowLeft, Settings, Database, User as UserIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import SettingsView from '@/components/SettingsView';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShortCode, setSelectedShortCode] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [activeView, setActiveView] = useState('links'); // 'links' or 'settings'
  const [userPlan, setUserPlan] = useState('free'); // NEW: Track user plan
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUrls();
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.data) {
        setUserPlan(data.data.plan || 'free'); 
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
    }
  };

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/url');
      setUrls(data.data);
    } catch (err) {
      console.error('Error fetching URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (shortCode, silent = false) => {
    try {
      if (!silent) setAnalyticsLoading(true);
      setSelectedShortCode(shortCode);
      const { data } = await api.get(`/analytics/${shortCode}`);
      setAnalytics(data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      if (!silent) setAnalyticsLoading(false);
    }
  };

  // Real-time polling effect
  useEffect(() => {
    let interval;
    if (selectedShortCode) {
      interval = setInterval(() => {
        fetchAnalytics(selectedShortCode, true);
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [selectedShortCode]);

  const handleUpdateUrl = (updatedUrl) => {
    setUrls(urls.map(u => u._id === updatedUrl._id ? updatedUrl : u));
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this link and its history?')) {
      try {
        await api.delete(`/url/${id}`);
        setUrls(urls.filter(url => url._id !== id));
        if (analytics && selectedShortCode === urls.find(u => u._id === id)?.shortCode) {
          setSelectedShortCode(null);
          setAnalytics(null);
        }
      } catch (err) {
        alert('Action failed');
      }
    }
  };

  const handleExport = async (shortCode) => {
    try {
      const response = await api.get(`/url/${shortCode}/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${shortCode}-analytics.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 pt-32 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black mb-6 transition-colors group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Front</span>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Elite Analytics Suite</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Manage Center.</h1>
          <p className="text-zinc-400 font-medium text-sm mt-2 max-w-md">Professional-grade link management and audience intelligence.</p>
          
          <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-2xl w-fit mt-8 border border-zinc-100">
             <TabButton 
                active={activeView === 'links'} 
                onClick={() => { setActiveView('links'); setSelectedShortCode(null); }} 
                icon={<Database className="w-3.5 h-3.5" />} 
                label="Inventory" 
             />
             <TabButton 
                active={activeView === 'settings'} 
                onClick={() => { setActiveView('settings'); setSelectedShortCode(null); }} 
                icon={<Settings className="w-3.5 h-3.5" />} 
                label="Protocol Settings" 
             />
          </div>
        </div>
        
        {activeView === 'links' && (
          <button 
            onClick={fetchUrls}
            className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 px-6 py-3 rounded-2xl transition-all border border-zinc-100 font-bold text-xs uppercase tracking-widest text-zinc-600 group"
          >
            <RefreshCcw className={`w-4 h-4 text-zinc-400 group-hover:text-black transition-colors ${loading ? 'animate-spin' : ''}`} />
            Refresh Registry
          </button>
        )}
      </div>

      {activeView === 'settings' ? (
        <SettingsView />
      ) : !selectedShortCode ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ShortenForm onUrlCreated={(newUrl) => setUrls([newUrl, ...urls])} />
          
          <div className="flex items-center gap-3 mb-8">
             <BarChart3 className="w-5 h-5 text-black" />
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black">Link Inventory</h2>
             <div className="h-px bg-zinc-100 flex-1" />
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Synchronizing Data...</p>
            </div>
          ) : urls.length > 0 ? (
            <UrlTable 
              urls={urls} 
              onDelete={handleDelete} 
              onSelect={fetchAnalytics}
              onUpdate={handleUpdateUrl}
            />
          ) : (
            <div className="border border-dashed border-zinc-200 rounded-[32px] p-12 flex flex-col items-center text-center bg-zinc-50/50">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-zinc-100">
                  <Link2 className="w-8 h-8 text-zinc-300" />
               </div>
               <h3 className="text-xl font-black text-black mb-2">No active signals detected.</h3>
               <p className="text-zinc-500 font-medium text-sm max-w-sm mb-8">
                 Initialize your first redirect protocol to begin tracking audience intelligence.
               </p>
               <button 
                  onClick={() => document.getElementById('url-input')?.focus()}
                  className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
               >
                 Create First Link
               </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-100">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setSelectedShortCode(null)}
                className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all group shadow-lg shadow-black/10"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to List</span>
              </button>
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <span className="text-indigo-500">{selectedShortCode}</span> 
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black bg-rose-500 text-white animate-pulse uppercase tracking-[0.2em]">Live</span>
                  Insights
                </h2>
                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                   <Activity className="w-3 h-3 text-emerald-500" />
                   Real-time Traffic stream active
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleExport(selectedShortCode)}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border border-emerald-100 font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all"
            >
              <Download className="w-4 h-4" />
              Export Dataset
            </button>
          </div>

          {analyticsLoading ? (
             <div className="py-20 flex flex-col items-center gap-4">
               <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Processing metrics...</p>
             </div>
          ) : analytics && (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {/* Stats Grid */}
              <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard 
                  label="Total Hits" 
                  value={analytics.totalClicks} 
                  icon={<MousePointer2 className="w-5 h-5" />} 
                  color="bg-indigo-500"
                />
                <StatCard 
                  label="Unique Reach" 
                  value={analytics.uniqueClicks} 
                  icon={<Users className="w-5 h-5" />} 
                  color="bg-emerald-500"
                />
                <StatCard 
                  label="Geo Markets" 
                  value={analytics.countryStats?.length || 0} 
                  icon={<Globe className="w-5 h-5" />} 
                  color="bg-amber-500"
                />
                <StatCard 
                  label="Peak Window" 
                  value={analytics.hourlyEngagement ? [...analytics.hourlyEngagement].sort((a,b) => b.value - a.value)[0]?.name : 'N/A'} 
                  icon={<Clock className="w-5 h-5" />} 
                  color="bg-rose-500"
                />
              </div>

              {/* Real-time Click stream */}
              <div className="md:col-span-6 bg-zinc-50/50 border border-zinc-100 rounded-[32px] p-8">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Live Activity Stream</h3>
                    </div>
                    <span className="text-[9px] font-black text-rose-500 uppercase px-2 py-1 bg-rose-50 rounded-md">Real-time</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {analytics.recentClicks.length > 0 ? analytics.recentClicks.map((click, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-black uppercase text-zinc-400">{formatDistanceToNow(new Date(click.createdAt))} ago</span>
                         </div>
                         <p className="text-xs font-black text-black mb-1">{click.city}, {click.country}</p>
                         <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">{click.browser} on {click.os}</p>
                      </div>
                    )) : (
                      <div className="col-span-full py-10 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        Waiting for new activity...
                      </div>
                    )}
                 </div>
              </div>

              {/* Charts */}
              <div className="md:col-span-4">
                <AnalyticsChart data={analytics.dailyClicks} title="TRAFFIC TIMELINE" type="line" />
              </div>
              <div className="md:col-span-2">
                <AnalyticsChart data={analytics.referrerStats} title="TRAFFIC SOURCES" type="bar" />
              </div>
              
              <div className="md:col-span-3">
                <AnalyticsChart data={analytics.hourlyEngagement} title="HOURLY ENGAGEMENT" type="bar" />
              </div>

              {/* City & Market Reach */}
              <div className="md:col-span-3">
                <div className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm h-full">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                     <MapPin className="w-3 h-3 text-rose-500" />
                     TOP CITIES & MARKETS
                   </h3>
                   <div className="space-y-4 relative">
                      {/* Gate Overlay */}
                      {['free', 'starter'].includes(userPlan) && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center mb-2 shadow-xl">
                                <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-black mb-1">Elite Feature</h4>
                            <p className="text-[10px] text-zinc-500 font-medium mb-3">Upgrade to see City-level data</p>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors">
                                Unlock
                            </button>
                        </div>
                      )}

                      {analytics.cityStats.length > 0 ? analytics.cityStats.slice(0, 6).map((c, i) => (
                        <div key={i} className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded-md bg-zinc-50 flex items-center justify-center text-[8px] font-black text-zinc-400 font-mono">{i+1}</span>
                              <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 font-mono">{c.name}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-black rounded-full" 
                                    style={{ width: `${(c.value / analytics.totalClicks) * 100}%` }} 
                                 />
                              </div>
                              <span className="text-sm font-black text-black font-mono">{c.value}</span>
                           </div>
                        </div>
                      )) : (
                        <div className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300">
                          Waiting for market data...
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
        active 
        ? 'bg-white text-black shadow-sm' 
        : 'text-zinc-400 hover:text-black hover:bg-zinc-100/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.06] transition-opacity`} />
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-')}/10 text-black`}>
          {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
        <TrendingUp className="w-4 h-4 text-zinc-200 group-hover:text-black transition-colors" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 relative z-10">{label}</p>
      <p className="text-3xl font-black tracking-tighter text-black relative z-10 font-mono italic">{value}</p>
    </div>
  );
}
