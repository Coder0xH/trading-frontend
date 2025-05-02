/**
 * 配置工具文件，用于统一管理API基础URL等配置项
 */

/**
 * 获取API基础URL
 * @returns API基础URL字符串
 */
export const getApiBaseUrl = (): string => {
  // Next.js 会自动将 NEXT_PUBLIC_ 开头的环境变量暴露给客户端
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://54.179.251.138:8000';
};

/**
 * 获取后端API URL
 * @returns 后端API URL字符串
 */
export const getBackendApiUrl = (): string => {
  // 服务端环境变量，只在服务端组件和API路由中可用
  return process.env.BACKEND_API_URL ?? 'http://54.179.251.138:8000';
};

/**
 * 配置对象，包含所有配置项
 */
const config = {
  apiBaseUrl: getApiBaseUrl(),
  backendApiUrl: getBackendApiUrl(),
};

export default config;
