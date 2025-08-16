import React from 'react';

import Navigation from './Navigation';
import AnalyticsManager from '../Analytics';
import Footer from './Footer';

import styles from '../../styles/Layout.module.scss';

type LayoutFrameProps = {
  activeSection?: string
}

export default function LayoutFrame({ activeSection, children }: React.PropsWithChildren<LayoutFrameProps>) {
  return (
    <>
      <div className={styles.page}>
        <Navigation activeSection={activeSection} />
        {children}
        <AnalyticsManager />
      </div>
      <Footer />
    </>
  )
}
