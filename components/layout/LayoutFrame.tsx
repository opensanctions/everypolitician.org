import React from 'react';

import AnalyticsManager from '@/components/Analytics';

import Footer from './Footer';
import Navigation from './Navigation';

type LayoutFrameProps = {
  activeSection?: string;
};

export default function LayoutFrame({
  activeSection,
  children,
}: React.PropsWithChildren<LayoutFrameProps>) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation activeSection={activeSection} />
      <main className="flex-grow-1">
        {children}
        <AnalyticsManager />
      </main>
      <Footer />
    </div>
  );
}
