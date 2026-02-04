"use client";
import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowLeft, Settings, Database, User as UserIcon,
  Search, Filter, ArrowDownWideNarrow, X, ArrowUpRight
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import SettingsView from '@/components/SettingsView';
import DestructiveModal from '@/components/DestructiveModal';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShortCode, setSelectedShortCode] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [activeView, setActiveView] = useState('links'); // 'links', 'settings', or 'overview'
  const [userPlan, setUserPlan] = useState('free'); // NEW: Track user plan
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
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

  const fetchOverview = async (silent = false) => {
    try {
      if (!silent) setAnalyticsLoading(true);
      const { data } = await api.get('/analytics/overview');
      setOverviewData(data.data);
    } catch (err) {
      console.error('Error fetching overview:', err);
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
      }, 5000);
    } else if (activeView === 'overview') {
      interval = setInterval(() => {
        fetchOverview(true);
      }, 8000); // Polling overview less frequently
    }
    return () => clearInterval(interval);
  }, [selectedShortCode, activeView]);

  const handleUpdateUrl = (updatedUrl) => {
    setUrls(urls.map(u => u._id === updatedUrl._id ? updatedUrl : u));
  };

  const handleDelete = (id) => {
    setLinkToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await api.delete(`/url/${linkToDelete}`);
      setUrls(urls.filter(url => url._id !== linkToDelete));
      if (analytics && selectedShortCode === urls.find(u => u._id === linkToDelete)?.shortCode) {
        setSelectedShortCode(null);
        setAnalytics(null);
      }
      setLinkToDelete(null);
      setDeleteModalOpen(false);
    } catch (err) {
      alert('Action failed');
    }
  };
  
  const filteredUrls = useMemo(() => {
    return urls
      .filter(url => {
        const matchesSearch = 
          url.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase());
        
        const now = new Date();
        const isExpired = url.expiresAt && new Date(url.expiresAt) < now;
        
        const matchesStatus = 
          statusFilter === 'all' ||
          (statusFilter === 'active' && url.isActive && !isExpired) ||
          (statusFilter === 'expired' && isExpired) ||
          (statusFilter === 'inactive' && !url.isActive) ||
          (statusFilter === 'onetime' && url.isOneTime);
          
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'hits') return b.totalClicks - a.totalClicks;
        if (sortBy === 'reach') return b.uniqueClicks - a.uniqueClicks;
        return 0;
      });
  }, [urls, searchQuery, statusFilter, sortBy]);

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
            <div className={`p-2 rounded-lg ${
              userPlan === 'starter' ? 'bg-emerald-50' : 
              userPlan === 'pro' ? 'bg-indigo-50' : 
              userPlan === 'business' ? 'bg-amber-50' : 
              'bg-zinc-100'
            }`}>
              <Zap className={`w-5 h-5 ${
                userPlan === 'starter' ? 'text-emerald-600 fill-emerald-600' : 
                userPlan === 'pro' ? 'text-indigo-600 fill-indigo-600' : 
                userPlan === 'business' ? 'text-amber-600 fill-amber-600' : 
                'text-zinc-400 fill-zinc-400'
              }`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                userPlan === 'starter' ? 'text-emerald-500' : 
                userPlan === 'pro' ? 'text-indigo-500' : 
                userPlan === 'business' ? 'text-amber-500' : 
                'text-zinc-400'
            }`}>
              {userPlan === 'starter' ? 'Growth Analytics' : userPlan === 'pro' ? 'Elite Analytics' : userPlan === 'business' ? 'Scale Analytics' : 'Basic Analytics'}
            </span>
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
                active={activeView === 'overview'} 
                onClick={() => { setActiveView('overview'); fetchOverview(); setSelectedShortCode(null); }} 
                icon={<Zap className={`w-3.5 h-3.5 ${activeView === 'overview' ? 'text-indigo-500' : ''}`} />} 
                label="Command Center" 
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
        <SettingsView urls={urls} onUpdateUrl={handleUpdateUrl} />
      ) : activeView === 'overview' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
           {/* COMMAND OVERVIEW STATS */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                 title="Total Signal Reach" 
                 value={overviewData?.totalClicks || 0} 
                 icon={<Zap className="w-5 h-5 text-indigo-500" />} 
                 trend="+14% this week"
              />
              <StatCard 
                 title="Unique Intelligence" 
                 value={overviewData?.uniqueClicks || 0} 
                 icon={<Users className="w-5 h-5 text-emerald-500" />} 
                 trend="+8% this week"
              />
              <StatCard 
                 title="Active Redirects" 
                 value={overviewData?.totalLinks || 0} 
                 icon={<Link2 className="w-5 h-5 text-amber-500" />} 
              />
              <StatCard 
                 title="Markets Tracked" 
                 value={overviewData?.countryStats?.length || 0} 
                 icon={<Globe className="w-5 h-5 text-rose-500" />} 
              />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                       <div>
                          <h3 className="text-xl font-black text-black">Global Traffic Pulse.</h3>
                          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">Real-time aggregate performance metrics</p>
                       </div>
                    </div>
                    {overviewData ? (
                       <AnalyticsChart data={overviewData.dailyClicks} />
                    ) : (
                       <div className="h-[300px] flex items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
                       </div>
                    )}
                 </div>
              </div>

              <div className="bg-zinc-950 text-white rounded-[40px] p-10 relative overflow-hidden group">
                 <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-white">Top 5 Performers.</h3>
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                        {overviewData?.topPerformers?.map((u, i) => (
                            <div key={i} className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black font-mono text-zinc-600 group-hover/item:text-indigo-400 transition-colors">0{i+1}</span>
                                    <div>
                                        <p className="text-sm font-black text-white group-hover/item:text-indigo-400 transition-colors uppercase tracking-tight">{u.shortCode}</p>
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest truncate max-w-[120px]">{(u.originalUrl || '').replace(/^https?:\/\//, '')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white font-mono">{u.hits}</p>
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Hits</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest mt-10 hover:bg-zinc-200 transition-all">
                        Full Performers List
                    </button>
                 </div>
              </div>
           </div>

           {/* REAL-TIME GLOBAL FEED */}
           <div className="bg-white border border-zinc-100 rounded-[40px] p-10">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xl font-black text-black">Live Pulse Stream.</h3>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1">Satellite intelligence across the entire matrix</p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Monitoring</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {overviewData?.recentClicks?.slice(0, 9).map((click, i) => (
                    <div key={i} className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 group hover:border-black transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center font-mono text-[10px] font-black text-zinc-400">
                                {(click.shortCode || '?')[0].toUpperCase()}
                             </div>
                             <div>
                                <h4 className="text-xs font-black text-black uppercase">{click.shortCode}</h4>
                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{format(new Date(click.createdAt), 'HH:mm:ss')}</p>
                             </div>
                          </div>
                          <span className="text-[8px] font-black text-zinc-400 px-2 py-1 bg-white border border-zinc-100 rounded-md">
                             {click.country || 'Global'}
                          </span>
                       </div>
                       <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
                          <div className="flex items-center gap-1.5 grayscale opacity-50">
                             <img src={`https://cdn-icons-png.flaticon.com/512/0/191.png`} className="w-3 h-3" />
                             <span className="text-[8px] font-black uppercase tracking-tighter">{click.browser || 'Web'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 grayscale opacity-50 ml-auto">
                             <Smartphone className="w-3 h-3" />
                             <span className="text-[8px] font-black uppercase tracking-tighter">{click.device || 'Mobile'}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      ) : !selectedShortCode ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ShortenForm onUrlCreated={(newUrl) => setUrls([newUrl, ...urls])} />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
               <BarChart3 className="w-5 h-5 text-black" />
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black">Link Inventory</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="text"
                  placeholder="Identify signal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-black focus:bg-white transition-all w-full md:w-64 outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 p-1.5 rounded-2xl">
                <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none pr-4 py-1.5 cursor-pointer"
                >
                  <option value="all">Global (All)</option>
                  <option value="active">Live Signals</option>
                  <option value="expired">Expired</option>
                  <option value="inactive">Suspended</option>
                  <option value="onetime">One-Time</option>
                </select>
              </div>

              {/* Sort Logic */}
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 p-1.5 rounded-2xl">
                <ArrowDownWideNarrow className="w-3.5 h-3.5 text-zinc-400 ml-2" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none pr-4 py-1.5 cursor-pointer"
                >
                  <option value="newest">Recent First</option>
                  <option value="oldest">Historical</option>
                  <option value="hits">Highest Traffic</option>
                  <option value="reach">Unique Reach</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Synchronizing Data...</p>
            </div>
          ) : filteredUrls.length > 0 ? (
            <UrlTable 
              urls={filteredUrls} 
              onDelete={handleDelete} 
              onSelect={fetchAnalytics}
              onUpdate={handleUpdateUrl}
            />
          ) : (
            <div className="border border-dashed border-zinc-200 rounded-[32px] p-20 flex flex-col items-center text-center bg-zinc-50/50">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-zinc-100">
                  <Search className="w-8 h-8 text-zinc-200" />
               </div>
               <h3 className="text-xl font-black text-black mb-2">Signal Not Found.</h3>
               <p className="text-zinc-500 font-medium text-sm max-w-sm mb-8">
                 Adjust your tracking filters or search parameters to locate the protocol.
               </p>
               <button 
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                  className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
               >
                 Reset Filters
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

      {/* MODALS */}
      <DestructiveModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Destroy Signal?"
        description="This will permanently terminate this redirect protocol and all its intelligence data. This action cannot be undone."
        confirmText="Confirm Destruction"
      />
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

function StatCard({ label, title, value, icon, color = 'bg-indigo-500', trend }) {
  const displayLabel = label || title;
  return (
    <div className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.06] transition-opacity`} />
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color}/10 text-black`}>
          {icon && React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
        {trend ? (
            <span className="text-[8px] font-black text-emerald-500 uppercase px-2 py-1 bg-emerald-50 rounded-md">{trend}</span>
        ) : (
            <TrendingUp className="w-4 h-4 text-zinc-200 group-hover:text-black transition-colors" />
        )}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 relative z-10">{displayLabel}</p>
      <p className="text-3xl font-black tracking-tighter text-black relative z-10 font-mono italic">{value}</p>
    </div>
  );
}
