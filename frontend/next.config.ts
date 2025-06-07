import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fastly.4sqi.net',
      },
      {
        protocol: 'https',
        hostname: 'fastly.fsqcdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // experimental: {
  //   turbo: {
  //     rules: {},
  //     resolveAlias: {},
  //   },
  //   ppr: 'incremental',
  // },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        zlib: false
      };
    }
    return config;
  },
};

export default nextConfig;