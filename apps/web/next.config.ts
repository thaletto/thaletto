import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.thaletto.dev',
  },
};

export default nextConfig;
