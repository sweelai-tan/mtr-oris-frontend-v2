import type { NextConfig } from 'next';
import packageJson from './package.json'; 

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    version: packageJson.version,
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/event-verification',
        permanent: true,
      },
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
