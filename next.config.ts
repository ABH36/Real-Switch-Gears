import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5.imimg.com",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
    ],
  },
};

export default nextConfig;
