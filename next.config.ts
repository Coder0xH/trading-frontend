import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 警告仍然会显示在控制台中，但不会导致构建失败
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
