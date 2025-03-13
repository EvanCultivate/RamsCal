/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Server Actions are enabled by default in Next.js 14
  }
};

module.exports = nextConfig; 