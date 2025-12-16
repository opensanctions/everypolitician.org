const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // serverExternalPackages: ['react-bootstrap-icons'],
  experimental: {
    optimizePackageImports: ['react-bootstrap-icons'],
    workerThreads: false,
    // dynamicIO: true,
    cpus: 1,
  },
  staticPageGenerationTimeout: 360,
  productionBrowserSourceMaps: true,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    quietDeps: true,
    silenceDeprecations: [
      /* Until bootstrap migrates _variables.scss to @use.
         https://github.com/twbs/bootstrap/issues/40962 */
      'import',
      /* Until next.js adds experimental support for new SASS API
         or stable support no sooner than NextJS 16
         https://github.com/vercel/next.js/issues/71638 */
      'legacy-js-api',
    ],
  },
  images: {
    unoptimized: true,
    // domains: ['assets.opensanctions.org', 'opensanctions.directus.app'],
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
