import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Force enable Fast Refresh
  reactStrictMode: true,
  
  // Thêm logging để debug
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
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
  
  // Cải thiện development experience
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      // Force refresh when files change
      forceSwcTransforms: true,
    }, 
  }),
  
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        zlib: false
      };
    }

    // Cải thiện hot reload trong development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };
    }

    return config;
  },
};

export default nextConfig;