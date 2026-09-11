import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/api/uploads/**" },
      { pathname: "/media/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
