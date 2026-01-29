/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler:
    process.env.NODE_ENV === 'production'
      ? require.resolve('./cache-handler.mjs')
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

module.exports = nextConfig;
