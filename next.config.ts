import type { NextConfig } from "next";
import path from "path";

/**
 * Next.js 配置
 */
const nextConfig: NextConfig = {
  output: "standalone",
  distDir: ".next",

  // 配置构建缓存
  poweredByHeader: false,
  generateBuildId: () => 'build',

  // 配置构建优化
  compiler: {
    // 移除 console.log
    // removeConsole: process.env.NODE_ENV === 'production',
  },

  // 添加安全头配置
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "viewport-fit",
            value: "cover",
          },
          {
            key: "viewport",
            value:
              "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
          },
        ],
      },
    ];
  },

  // 重写请求地址
  async rewrites() {
    // 获取API URL，优先使用环境变量
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://13.250.110.158:8000";
    const apiUrl = "http://13.250.110.158:8000";
    
    console.log(`当前环境: ${process.env.NODE_ENV}, API URL: ${apiUrl}`);
    
    // 在所有环境中重写API请求
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // 配置别名
  experimental: {
    turbo: {
      resolveAlias: {
        "@": path.join(__dirname, "src"),
      },
    },
  },
};

export default nextConfig;
