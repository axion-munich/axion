import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.tildacdn.net",
      },
      {
        protocol: "https",
        hostname: "thb.tildacdn.net",
      },
    ],
  },
};

export default nextConfig;
