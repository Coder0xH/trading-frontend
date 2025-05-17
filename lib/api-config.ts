/**
 * 配置工具文件，用于统一管理API基础URL等配置项
 */

/**
 * 获取客户端 API 基础 URL
 */
export const getApiBaseUrl = (): string => {
  // Next.js 会自动将 NEXT_PUBLIC_ 开头的环境变量暴露给客户端
  // 确保 URL 包含协议
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'localhost:8000';
  return baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`;
};

/**
 * 获取后端 API URL
 */
export const getBackendApiUrl = (): string => {
  // 服务端环境变量，只在服务端组件和API路由中可用
  const backendUrl = process.env.BACKEND_API_URL ?? 'localhost:8000';
  return backendUrl.startsWith('http') ? backendUrl : `http://${backendUrl}`;
};

/**
 * 配置对象，包含所有配置项
 */
const config = {
  apiBaseUrl: getApiBaseUrl(),
  backendApiUrl: getBackendApiUrl(),
};

export default config;
