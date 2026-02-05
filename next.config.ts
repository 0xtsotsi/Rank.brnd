import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    ignoreDuringTests: true,
  },
  
  // Sentry configuration - properly typed for TypeScript
  sentry: {
    // Sentry is configured via sentry.client.config.ts and sentry.server.config.ts
    // No explicit config needed here
  },
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    // REMOVED: optimizePackageImports (causing build error)
  },
  
  // Optimize images - use standard format
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
  
  // Security headers - minimal but effective
  headers: async () => {
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.com https://*.clerk.accounts.dev;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://*.clerk.com https://*.clerk.accounts.dev;
      connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.clerk.com https://*.clerk.accounts.dev;
      media-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ');
      .trim();

    return [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'onerror=off',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
      },
    ];
  },
};

export default nextConfig;
