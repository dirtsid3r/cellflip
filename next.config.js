/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only run ESLint on the following directories during production builds
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Don't fail builds for TypeScript errors during development
    ignoreBuildErrors: false,
  },
  // Allow external images from placeholder services
  images: {
    domains: ['api.placeholder.com', 'picsum.photos'],
  },
};

module.exports = nextConfig; 