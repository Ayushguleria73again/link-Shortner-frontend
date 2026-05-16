"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import SettingsView from '@/components/settings/SettingsView';
import HubView from '@/components/dashboard/HubView';
import DestructiveModal from '@/components/ui/DestructiveModal';

// Extracted Dashboard Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import InventoryView from '@/components/dashboard/InventoryView';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import LinkDetailsView from '@/components/dashboard/LinkDetailsView';
import UpgradeGate from '@/components/dashboard/UpgradeGate';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShortCode, setSelectedShortCode] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [activeView, setActiveView] = useState('links'); // 'links', 'settings', 'overview', or 'hub'
  const [userPlan, setUserPlan] = useState('free');
  const [username, setUsername] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUrls();
    fetchCampaigns();
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const [userRes, profileRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/profile/me')
      ]);

      if (userRes.data.data) {
        setUserPlan(userRes.data.data.plan || 'free'); 
      }
      if (profileRes.data.data) {
        setUsername(profileRes.data.data.username);
      }
    } catch (err) {
      console.error('Error fetching plan/profile:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get('/campaigns');
      setCampaigns(data.data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
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
      }, 8000);
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
          
        const matchesCampaign = !selectedCampaignId || url.campaignId === selectedCampaignId;
          
        return matchesSearch && matchesStatus && matchesCampaign;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'hits') return b.totalClicks - a.totalClicks;
        if (sortBy === 'reach') return b.uniqueClicks - a.uniqueClicks;
        return 0;
      });
  }, [urls, searchQuery, statusFilter, sortBy, selectedCampaignId]);

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
      <DashboardHeader 
        userPlan={userPlan}
        activeView={activeView}
        setActiveView={setActiveView}
        setSelectedShortCode={setSelectedShortCode}
        fetchOverview={fetchOverview}
        fetchUrls={fetchUrls}
        loading={loading}
      />

      <main>
        {activeView === 'settings' ? (
          <SettingsView 
            urls={urls} 
            onUpdateUrl={handleUpdateUrl} 
            onCampaignSelect={(id) => {
              setSelectedCampaignId(id);
              setActiveView('links');
            }}
          />
        ) : activeView === 'hub' ? (
          <HubView username={username} userPlan={userPlan} />
        ) : activeView === 'overview' ? (
          <div className="relative">
            {['free', 'starter'].includes(userPlan) && (
              <UpgradeGate onReturn={() => setActiveView('links')} />
            )}
            <AnalyticsOverview 
              overviewData={overviewData}
              userPlan={userPlan}
              showAllMarkets={showAllMarkets}
              setShowAllMarkets={setShowAllMarkets}
              loading={analyticsLoading}
              setActiveView={setActiveView}
            />
          </div>
        ) : !selectedShortCode ? (
          <InventoryView 
            urls={urls}
            setUrls={setUrls}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
            campaigns={campaigns}
            filteredUrls={filteredUrls}
            handleDelete={handleDelete}
            fetchAnalytics={fetchAnalytics}
            handleUpdateUrl={handleUpdateUrl}
            username={username}
          />
        ) : (
          <LinkDetailsView 
            selectedShortCode={selectedShortCode}
            setSelectedShortCode={setSelectedShortCode}
            analytics={analytics}
            analyticsLoading={analyticsLoading}
            handleExport={handleExport}
            userPlan={userPlan}
          />
        )}
      </main>

      <DestructiveModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Destroy Signal?"
        message="This will permanently delete the link and all associated tracking data. This action cannot be reversed."
      />
    </div>
  );
}
