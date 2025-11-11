/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/.prisma/client/**/*'],
  },
  images: {
    // Production-friendly allowlist of common news/CDN hosts. This is intentionally
    // restrictive to avoid allowing arbitrary remote hosts. If an image is
    // blocked by this policy it will gracefully fall back in the UI to an
    // explanatory placeholder instead of crashing the client.
  // Allowlist for remote images (external hosts)
  remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.bwbx.io' },
      { protocol: 'https', hostname: 'platform.theverge.com' },
      { protocol: 'https', hostname: 'www.engadget.com' },
      { protocol: 'https', hostname: 'arstechnica.com' },
      { protocol: 'https', hostname: 'sciencedaily.com' },
      { protocol: 'https', hostname: 'technologyreview.com' },
      { protocol: 'https', hostname: 'phys.org' },
      { protocol: 'https', hostname: 'bloomberg.com' },
      { protocol: 'https', hostname: 'forbes.com' },
      { protocol: 'https', hostname: 'entrepreneur.com' },
      { protocol: 'https', hostname: 'thehackernews.com' },
      { protocol: 'https', hostname: 'krebsonsecurity.com' },
      { protocol: 'https', hostname: 'schneier.com' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'blogger.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'imageio.forbes.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'i.guim.co.uk' },
      { protocol: 'https', hostname: 'images.wsj.net' },
      { protocol: 'https', hostname: 'images.theguardian.com' },
      { protocol: 'https', hostname: 'media.cnn.com' },
      { protocol: 'https', hostname: 'preview.redd.it' },
      { protocol: 'https', hostname: 'i.redd.it' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'cloudfront.net' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'static01.nyt.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'cdn.vox-cdn.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'media.giphy.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'static01.cdninstagram.com' },
      { protocol: 'https', hostname: 'fastly.4sqi.net' },
      { protocol: 'https', hostname: 'assets.buzzfeed.com' },
      { protocol: 'https', hostname: 'cdn.theatlantic.com' },
      { protocol: 'https', hostname: 'cdn.cnn.com' },
      { protocol: 'https', hostname: 'media.npr.org' },
      { protocol: 'https', hostname: 'content.jwplatform.com' },
      { protocol: 'https', hostname: 'images.theconversation.com' },
      // Allow localhost for local development (http)
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
    // Local patterns allow using a path like `/api/image-proxy/{id}` with next/image
    // This enables the built-in image optimizer to accept same-origin API routes.
    localPatterns: [
      { pathname: '/api/image-proxy/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  turbopack: {},
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Compression
  compress: true,
  // Skip static generation errors
  staticPageGenerationTimeout: 300,
  // Generate 404 page dynamically
  generateBuildId: async () => {
    return 'feedcentral-build-' + Date.now();
  },
};

module.exports = withNextIntl(nextConfig);
