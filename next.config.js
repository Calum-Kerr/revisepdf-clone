/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  poweredByHeader: false, // Remove the X-Powered-By header
  reactStrictMode: true,
  // Heroku deployment configuration
  staticPageGenerationTimeout: 180, // Increase timeout for static page generation (in seconds)
  // Using standalone output instead of export for API route compatibility
  output: 'standalone',
  experimental: {
    // Remove unsupported experimental option
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  images: {
    domains: [
      'www.revisepdf.com',
      'revisepdf.com',
      'placehold.co',
      'same-assets.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Production environment settings
  env: {
    NEXTAUTH_DEMO_MODE: process.env.NEXTAUTH_DEMO_MODE || 'false',
  },
  // Custom headers for SEO, security, and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Headers for caching static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|webp|avif|otf|ttf|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Redirects for canonical URLs and legacy paths
  async redirects() {
    return [
      // Redirect trailing slashes
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // Example legacy redirects (add more as needed)
      {
        source: '/compress',
        destination: '/optimise/compress',
        permanent: true,
      },
      {
        source: '/merge',
        destination: '/organise/merge',
        permanent: true,
      },
    ];
  },
  // Override webpack config for optimizations if needed
  webpack(config) {
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
