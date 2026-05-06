import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript hataları olsa bile build işleminin devam etmesini sağlar
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
