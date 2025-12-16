import { Viewport } from 'next';
import localFont from 'next/font/local';
// import SSRProvider from 'react-bootstrap/SSRProvider';

import { THEME_COLOR } from '@/lib/constants';

import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';

const monaSans = localFont({
  src: '../public/fonts/Mona-Sans.woff2',
  display: 'swap',
  variable: '--font-mona-sans',
  weight: '200 900', // Mona Sans weight range
  adjustFontFallback: false,
  style: 'normal',
  // declarations: [
  //   {
  //     prop: 'font-variation-settings',
  //     value: '"wdth" 100, "ital" 0',
  //   },
  // ],
});

const monaSpace = localFont({
  src: '../public/fonts/MonaspaceNeon.var.woff2',
  display: 'swap',
  variable: '--font-monaspace',
  weight: '200 800', // Monaspace weight range
  adjustFontFallback: false,
});

export const metadata = {
  title: {
    template: '%s - OpenSanctions',
    default: 'OpenSanctions',
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${monaSans.variable} ${monaSpace.variable}`}>
      <head>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="OpenSanctions Search"
          href="/opensearch.xml"
        />
      </head>
      <body>
        <>{children}</>
      </body>
    </html>
  );
}
