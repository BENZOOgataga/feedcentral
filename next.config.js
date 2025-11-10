/** @type {import('next').NextConfig} */

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/.prisma/client/**/*'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        // Allow http hosts as some RSS feeds / images may provide http URLs.
        protocol: 'http',
        hostname: '**',
      },
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
