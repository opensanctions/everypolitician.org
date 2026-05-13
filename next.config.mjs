import { fileURLToPath } from 'url';
import createMDX from '@next/mdx';

// 'unsafe-inline' is required for Next.js hydration scripts and the GTM init
// inline script (Analytics.tsx). To remove it, adopt nonce-based CSP via
// Next.js middleware.
// 'unsafe-eval' is added in dev only for Turbopack HMR.
const isDev = process.env.NODE_ENV === 'development';
const contentSecurityPolicyHeaderValue = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
  // Path-scoped: GA4 pings /g/collect on www.google.com for cross-domain
  // measurement. If a future GA update redirects this path, the redirect
  // target will need its own allowlist entry (CSP paths don't follow 30x).
  "connect-src 'self' https://api.opensanctions.org https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com/g/collect",
  "img-src 'self' data: https://assets.opensanctions.org https://www.google-analytics.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  // EP embeds no iframes. Without this, frame-src falls back to default-src 'self',
  // which would still permit same-origin frames. If we ever add an embed (YouTube,
  // a map, etc.), allowlist its origin here. Or change to 'self' to allow same-origin.
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  cacheHandler:
    process.env.NODE_ENV === 'production'
      ? fileURLToPath(import.meta.resolve('./cache-handler.mjs'))
      : undefined,
  cacheMaxMemorySize: process.env.NODE_ENV === 'production' ? 0 : undefined,
  reactStrictMode: true,
  staticPageGenerationTimeout: 360,
  productionBrowserSourceMaps: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.opensanctions.org',
      },
      // TODO: remove directus for images? alternatively, add to CSP
      {
        protocol: 'https',
        hostname: 'opensanctions.directus.app',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        // Switch to Content-Security-Policy once validated in staging.
        // report-only — browsers log violations to the console but nothing is blocked.
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: contentSecurityPolicyHeaderValue,
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
