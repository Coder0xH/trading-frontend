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
    // 移除 线上环境的 console.log
    removeConsole: process.env.NODE_ENV === 'production',
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
    // 根据环境变量选择API URL
    let apiUrl;
    
    // 在生产环境中使用 PROD_API_URL
    if (process.env.NODE_ENV === 'production') {
      apiUrl = process.env.PROD_API_URL || 'http://13.250.110.158:8000';
      console.log('Using production API URL:', apiUrl);
    } 
    // 在开发环境中使用 DEV_API_URL
    else {
      apiUrl = process.env.DEV_API_URL || 'http://localhost:8000';
      console.log('Using development API URL:', apiUrl);
    }
    
    // 重写API请求
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

};

export default nextConfig;
