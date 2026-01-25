import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn con bên trong
      },
    ],
  },

};

export default nextConfig;
