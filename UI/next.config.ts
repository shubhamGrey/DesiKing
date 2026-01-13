import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cloud.agronexis.com",
      }
    ],
    // Allow optimization for supported formats
    formats: ["image/webp", "image/avif"],
    // Add custom device sizes for better optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable experimental features for better image handling
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },
  // Use proxy configuration instead of deprecated middleware
  skipProxyUrlNormalize: true,
};

export default nextConfig;
