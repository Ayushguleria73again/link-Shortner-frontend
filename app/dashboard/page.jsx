"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { 
  useUserAuth, 
  useCampaigns, 
  useUrls, 
  useLinkAnalytics, 
  useOverviewAnalytics,
  useDeleteUrl
} from '@/hooks/useQueries';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [selectedShortCode, setSelectedShortCode] = useState(null);
  const [activeView, setActiveView] = useState('links'); 
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const router = useRouter();

  // Redirect if no token, handle incoming link requests
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
    const linkParam = searchParams.get('link');
    if (linkParam) {
        setSelectedShortCode(linkParam);
    }
  }, [router, searchParams]);

  // Use Centralized Hooks
  const { data: userData } = useUserAuth();
  const userPlan = userData?.plan || 'free';
  const username = userData?.username;

  const { data: campaigns = [] } = useCampaigns();
  const { isLoading: loading, data: urls = [], refetch: fetchUrls } = useUrls();
  
  const { isLoading: analyticsLoading, data: analytics } = useLinkAnalytics(selectedShortCode);
  const { data: overviewData, isLoading: overviewLoading } = useOverviewAnalytics(activeView === 'overview');

  const handleUpdateUrl = (updatedUrl) => {
    queryClient.setQueryData(['urls'], (old) => 
      old?.map(u => u._id === updatedUrl._id ? updatedUrl : u)
    );
  };

  const handleDelete = (id) => {
    setLinkToDelete(id);
    setDeleteModalOpen(true);
  };

  const { mutate: confirmDelete } = useDeleteUrl();

  const handleConfirmDelete = () => {
    confirmDelete(linkToDelete, {
      onSuccess: () => {
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
              urls={urls}
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
        onConfirm={handleConfirmDelete}
        title="Delete Link?"
        message="This will permanently delete the link and all associated tracking data. This action cannot be reversed."
      />
    </div>
  );
}
