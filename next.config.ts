import type { NextConfig } from "next";

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://13.250.110.158:8000";
    
    // 在生产环境中使用不同的rewrites配置
    if (process.env.VERCEL) {
      console.log('在Vercel上运行，使用特殊的rewrites配置');
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
          // 添加自定义头信息来解决可能的CORS问题
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
            "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          },
        },
      ];
    }
    
    // 在开发环境中使用标准rewrites配置
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

};

export default nextConfig;
