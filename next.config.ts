import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/packages',
        destination: '/packages.html',
      },
    ];
  },
};

export default nextConfig;
