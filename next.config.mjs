/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable experimental features for App Router
  experimental: {
    // Type-safe route parameters
    typedRoutes: true,
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      // Add remote image patterns here as needed
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
    ],
  },

  // Environment variables that should be available on the client
  // env: {},

  // Redirects, rewrites, and headers can be configured here
  // async redirects() { return []; },
  // async rewrites() { return []; },
  // async headers() { return []; },

  // Webpack configuration customization
  webpack: (config, { isServer }) => {
    // Custom webpack configuration can be added here
    return config;
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,

  // Compress responses
  compress: true,
};

export default nextConfig;
