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

  // 开发环境下重写请求地址
  async rewrites() {
    // 只在开发环境中重写API请求
    if (process.env.NODE_ENV === "development") {
      const apiUrl = "http://localhost:8000";
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
        },
      ];
    }
    return [];
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
