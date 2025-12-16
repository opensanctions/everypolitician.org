/** @type {import('next').NextConfig} */
const nextConfig = {
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
