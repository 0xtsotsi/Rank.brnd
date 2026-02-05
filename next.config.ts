/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // During builds we'll turn off ESLint to not slow down the build
    // We will also turn off ESLint when developing with dev server
    ignoreDuringBuilds: true,
    ignoreDuringTests: true,
  },
};

export default nextConfig;
