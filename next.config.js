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
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.bwbx.io' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'static01.nyt.com' },
      { protocol: 'https', hostname: 'cdn.cnn.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'media.npr.org' },
      { protocol: 'https', hostname: 'cdn.vox-cdn.com' },
      { protocol: 'https', hostname: 'content.jwplatform.com' },
      { protocol: 'https', hostname: 'images.theconversation.com' },
      // Allow localhost for local development (http)
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
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
