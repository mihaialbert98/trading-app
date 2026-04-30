import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow news thumbnails from various finance news providers
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
