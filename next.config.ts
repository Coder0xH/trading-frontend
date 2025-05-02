import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 警告仍然会显示在控制台中，但不会导致构建失败
    ignoreDuringBuilds: true,
  },
  // 环境变量配置 - 注意：这里定义的环境变量会在构建时被注入
  env: {
    // 这些值会覆盖.env文件中的同名变量
    // 只有在构建时需要固定值时才在这里设置
  },
};

export default nextConfig;
