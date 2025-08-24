import { Viewport } from 'next';
// import SSRProvider from 'react-bootstrap/SSRProvider';

import { THEME_COLOR } from '@/lib/constants';

import '@/styles/globals.scss';


export const metadata = {
  title: {
    template: '%s - OpenSanctions',
    default: 'OpenSanctions'
  },
}

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="search" type="application/opensearchdescription+xml" title="OpenSanctions Search" href="/opensearch.xml" />
      </head>
      <body>
        <>
          {children}
        </>
      </body>
    </html>
  );
}
