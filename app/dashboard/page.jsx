import React, { Suspense } from 'react';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-950 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardClient />
    </Suspense>
  );
}
