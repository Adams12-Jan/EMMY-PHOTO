/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RouterProvider, Route, useRouter } from './components/Router';
import Navigation from './components/Navigation';
import PublicFooter from './components/PublicFooter';
import PublicWebsite from './views/PublicWebsite';
import AdminPortal from './views/AdminPortal';
import { AppDatabase } from './types';
import { Camera, RefreshCw } from 'lucide-react';
import { apiFetch } from './utils/api';

function AppContent() {
  const { currentPath } = useRouter();
  const [db, setDb] = useState<AppDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Load database state from custom Express server
  const fetchDbState = async () => {
    try {
      const res = await apiFetch('/api/db');
      if (!res.ok) throw new Error('Fail to retrieve dynamic assets database.');
      const data = await res.json();
      setDb(data);
    } catch (err) {
      console.error('Core synchronizer offline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbState();
  }, []);

  if (loading || !db) {
    return (
      <div className="bg-[#09090b] min-h-screen text-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="space-y-4 flex flex-col items-center animate-pulse">
          <Camera className="w-8 h-8 text-rose-500 animate-spin" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#a1a1aa]">Loading EMMYSS Studio</h2>
          <p className="text-xs text-neutral-600 font-mono">Synchronizing database blocks...</p>
        </div>
      </div>
    );
  }

  const isRouteAdmin = currentPath.startsWith('/admin');

  return (
    <div className="bg-[#09090b] text-neutral-150 min-h-screen flex flex-col">
      {/* 1. Public Specific Header elements */}
      {!isRouteAdmin && (
        <Navigation 
          settings={db.settings} 
          onBookClick={() => setBookingOpen(true)} 
        />
      )}

      {/* 2. Main screen matching content layout */}
      <div className="flex-1">
        <Route 
          path="/" 
          element={
            <PublicWebsite 
              db={db} 
              onRefreshDb={fetchDbState} 
              bookingOpen={bookingOpen}
              setBookingOpen={setBookingOpen}
            />
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <AdminPortal 
              db={db} 
              onRefreshDb={fetchDbState} 
            />
          } 
        />
      </div>

      {/* 3. Public Specific footer elements */}
      {!isRouteAdmin && (
        <PublicFooter settings={db.settings} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
