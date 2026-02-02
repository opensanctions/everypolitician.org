import React from 'react';

import AnalyticsManager from '@/components/Analytics';

import Footer from './Footer';
import Navigation from './Navigation';

export default function LayoutFrame({ children }: React.PropsWithChildren) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="flex-grow-1">
        {children}
        <AnalyticsManager />
      </main>
      <Footer />
    </div>
  );
}
