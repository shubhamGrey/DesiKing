import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // Or 'https' depending on the actual protocol used by cloud.agronexis.com
        hostname: "cloud.agronexis.com",
        port: "",
        pathname: "/s/**", // Adjust the pathname pattern if needed to match your file structure
      },
    ],
  },
};

export default nextConfig;
