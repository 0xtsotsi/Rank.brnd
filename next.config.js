/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ============================================
  // Security Headers Configuration
  // Protects against XSS, clickjacking, and other vulnerabilities
  // ============================================

  // Power off x-powered-by header for security and smaller response
  poweredByHeader: false,

  // ============================================
  // Core Web Vitals Optimization Configuration
  // Targets: LCP < 2.5s, FID < 100ms, CLS < 0.1
  // ============================================

  // Image optimization for LCP improvement
  images: {
    // Enable modern image formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Configure device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Configure image sizes for srcset generation
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize layout shift with blur placeholder
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Allow images from common CDNs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },

  // Enable compression for faster transfers
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // Enable strict mode for better performance patterns
  reactStrictMode: true,

  // Configure headers for performance, caching, and security
  async headers() {
    // Content Security Policy
    // Controls which resources the browser is allowed to load
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.com https://*.clerk.accounts.dev;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://*.clerk.com https://*.clerk.accounts.dev;
      font-src 'self' data:;
      connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.clerk.com https://*.clerk.accounts.dev;
      media-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // Content Security Policy (CSP)
          // Mitigates XSS attacks by controlling which resources can be loaded
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
          // Strict-Transport-Security (HSTS)
          // Forces HTTPS connections for the specified duration
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // X-Frame-Options
          // Prevents clickjacking attacks by blocking iframe embedding
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options
          // Prevents MIME sniffing to reduce XSS risk
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // X-XSS-Protection
          // Enables browser's XSS filtering (legacy, but still useful)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer-Policy
          // Controls how much referrer information is sent
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions-Policy
          // Disables browser features that could be exploited
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Enable preloading for critical resources
          {
            key: 'Link',
            value:
              '</fonts/inter-var.woff2>; rel=preload; as=font; type="font/woff2"; crossorigin',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  // Webpack configuration for code splitting and optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only
    if (!dev && !isServer) {
      // Split chunks more aggressively for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            // Vendor chunk for node_modules
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              reuseExistingChunk: true,
            },
            // Framework chunk for React/Next.js
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              name: 'framework',
              priority: 40,
              enforce: true,
            },
            // Common chunk for shared code
            common: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
