"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import SettingsView from '@/components/settings/SettingsView';
import HubView from '@/components/dashboard/management/HubView';
import DestructiveModal from '@/components/ui/DestructiveModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Extracted Dashboard Components
import DashboardHeader from '@/components/dashboard/ui/DashboardHeader';
import InventoryView from '@/components/dashboard/inventory/InventoryView';
import AnalyticsOverview from '@/components/dashboard/analytics/AnalyticsOverview';
import LinkDetailsView from '@/components/dashboard/inventory/LinkDetailsView';
import UpgradeGate from '@/components/dashboard/ui/UpgradeGate';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [selectedShortCode, setSelectedShortCode] = useState(null);
  const [activeView, setActiveView] = useState('links'); // 'links', 'settings', 'overview', or 'hub'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const router = useRouter();

  // Redirect if no token
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  // Query: User Auth & Profile
  const { data: userData } = useQuery({
    queryKey: ['userAuth'],
    queryFn: async () => {
      const [userRes, profileRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/profile/me')
      ]);
      return {
        plan: userRes.data.data?.plan || 'free',
        username: profileRes.data.data?.username
      };
    },
  });

  const userPlan = userData?.plan || 'free';
  const username = userData?.username;

  // Query: Campaigns
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns');
      return data.data;
    },
  });

  // Query: URLs
  const { isLoading: loading, data: urls = [], refetch: fetchUrls } = useQuery({
    queryKey: ['urls'],
    queryFn: async () => {
      const { data } = await api.get('/url');
      return data.data;
    },
  });

  // Query: Analytics for selected link
  const { isLoading: analyticsLoading, data: analytics } = useQuery({
    queryKey: ['analytics', selectedShortCode],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/${selectedShortCode}`);
      return data.data;
    },
    enabled: !!selectedShortCode,
    refetchInterval: selectedShortCode ? 5000 : false,
  });

  // Query: Overview Analytics
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['overviewAnalytics'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/overview');
      return data.data;
    },
    enabled: activeView === 'overview',
    refetchInterval: activeView === 'overview' ? 8000 : false,
  });

  const handleUpdateUrl = (updatedUrl) => {
    queryClient.setQueryData(['urls'], (old) => 
      old?.map(u => u._id === updatedUrl._id ? updatedUrl : u)
    );
  };

  const handleDelete = (id) => {
    setLinkToDelete(id);
    setDeleteModalOpen(true);
  };

  // Mutation: Confirm Delete
  const { mutate: confirmDelete } = useMutation({
    mutationFn: async () => {
      if (!linkToDelete) return;
      return api.delete(`/url/${linkToDelete}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
      if (analytics && selectedShortCode === urls.find(u => u._id === linkToDelete)?.shortCode) {
        setSelectedShortCode(null);
      }
      setLinkToDelete(null);
      setDeleteModalOpen(false);
    },
    onError: () => {
      alert('Could not delete link');
    }
  });
  
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
        fetchOverview={() => queryClient.invalidateQueries(['overviewAnalytics'])}
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
              loading={overviewLoading}
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
            fetchAnalytics={setSelectedShortCode}
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
        title="Delete Link?"
        message="This will permanently delete the link and all associated tracking data. This action cannot be reversed."
      />
    </div>
  );
}
