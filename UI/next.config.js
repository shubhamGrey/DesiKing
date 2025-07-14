/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cloud.agronexis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloud.agronexis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
