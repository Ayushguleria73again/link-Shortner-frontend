"use client";
import React from 'react';
import { Search, Filter, ArrowDownWideNarrow, X, Loader2, ExternalLink } from 'lucide-react';
import ShortenForm from '@/components/landing/ShortenForm';
import UrlTable from '@/components/dashboard/inventory/UrlTable';

const InventoryView = ({
    urls,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    selectedCampaignId,
    setSelectedCampaignId,
    campaigns,
    filteredUrls,
    handleDelete,
    fetchAnalytics,
    handleUpdateUrl,
    username
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShortenForm />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black tracking-tight text-black flex items-center gap-4">
                        Inventory.
                        {username && (
                            <a
                                href={`/u/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-zinc-50 hover:bg-zinc-100 p-2 rounded-xl transition-all group"
                                title="View Hub"
                            >
                                <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-black" />
                            </a>
                        )}
                    </h2>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search links..."
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
                            <option value="all">All Status</option>
                            <option value="active">Live</option>
                            <option value="expired">Expired</option>
                            <option value="inactive">Paused</option>
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
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="hits">Most Hits</option>
                            <option value="reach">Most Reach</option>
                        </select>
                    </div>
                </div>
            </div>

            {selectedCampaignId && (
                <div className="flex items-center gap-4 mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl w-fit animate-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900">
                            Campaign Filter: <span className="italic">{campaigns.find(c => c._id === selectedCampaignId)?.name || 'Registry'}</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedCampaignId(null)}
                        className="text-[9px] font-black uppercase text-indigo-500 hover:text-indigo-700 underline tracking-widest"
                    >
                        Clear Filter
                    </button>
                </div>
            )}

            {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Loading your links...</p>
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
                    <h3 className="text-xl font-black text-black mb-2">No links found.</h3>
                    <p className="text-zinc-500 font-medium text-sm max-w-sm mb-8">
                        Try adjusting your filters or search terms to find what you're looking for.
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
    );
};

export default InventoryView;
