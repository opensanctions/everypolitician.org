import { fileURLToPath } from 'url';
import createMDX from '@next/mdx';

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
      {
        protocol: 'https',
        hostname: 'opensanctions.directus.app',
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
