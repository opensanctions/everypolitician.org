const path = require('path');

const cachedHeader = [
  {
    key: 'cache-control',
    value: 'public, max-age=3600, stale-while-revalidate=1800',
  },
];

const secureHeaders = [
  {
    key: 'x-frame-options',
    value: 'DENY',
  },
  {
    key: 'cache-control',
    value: 'private, max-age=0, no-cache',
  },
]

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
  cacheHandler:
    process.env.NODE_ENV === "production"
      ? require.resolve("./cache-handler.mjs")
      : undefined,
  cacheMaxMemorySize:
    process.env.NODE_ENV === "production"
      ? 0
      : 250 * 1024 * 1024,
  // cacheMaxMemorySize: 250 * 1024 * 1024,
  staticPageGenerationTimeout: 360,
  productionBrowserSourceMaps: true,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    quietDeps: true,
    silenceDeprecations: [
      /* Until bootstrap migrates _variables.scss to @use.
         https://github.com/twbs/bootstrap/issues/40962 */
      "import",
      /* Until next.js adds experimental support for new SASS API
         or stable support no sooner than NextJS 16
         https://github.com/vercel/next.js/issues/71638 */
      "legacy-js-api",
    ],
  },
  images: {
    unoptimized: true,
    // domains: ['assets.opensanctions.org', 'opensanctions.directus.app'],
    remotePatterns: [
      {
        "protocol": "https",
        "hostname": "assets.opensanctions.org",
      },
      {
        "protocol": "https",
        "hostname": "opensanctions.directus.app",
      }
    ]
  },
  async redirects() {
    return [
    ]
  },
  async headers() {
    return [
      {
        source: "/docs/:path*",
        headers: cachedHeader,
      },
      {
        source: "/faq/:path*",
        headers: cachedHeader,
      },
      {
        source: "/entities/:path*",
        headers: cachedHeader,
      },
      {
        source: "/datasets/:path*",
        headers: cachedHeader,
      },
      {
        source: "/programs/:path*",
        headers: cachedHeader,
      },
      {
        source: "/countries/:path*",
        headers: cachedHeader,
      }
    ]
  }
};

// if (
//   process.env.NODE_ENV === "production" && (
//     process.env.CACHE_BACKEND == "redis-strings" ||
//     process.env.CACHE_BACKEND == "local-lru")
// ) {
//   nextConfig.cacheHandler = require.resolve("./cache-handler.js");
//   cacheMaxMemorySize: 0;
// }


module.exports = nextConfig
