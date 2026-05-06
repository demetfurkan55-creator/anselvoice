import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript hataları olsa bile build işleminin devam etmesini sağlar
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint hatalarının build (yayına alma) sürecini durdurmasını engeller
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
