import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // GitHub Pages doesn't support Image Optimization
  },
};

export default nextConfig;
