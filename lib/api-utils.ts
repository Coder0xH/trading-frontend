/**
 * API 工具模块
 * 提供所有 API 路由共享的功能和配置
 */
import { NextResponse } from 'next/server';
import config from '@/lib/api-config';

/**
 * API 基础 URL 配置
 */
export const API_BASE_URL = config.apiBaseUrl;
export const BACKEND_API_URL = config.backendApiUrl;

/**
 * 创建 API 响应
 * @param data 响应数据
 * @param status HTTP 状态码
 * @returns NextResponse 对象
 */
export function createApiResponse(data: unknown, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * 创建错误响应
 * @param message 错误消息
 * @param status HTTP 状态码
 * @returns NextResponse 对象
 */
export function createErrorResponse(message: string, status: number = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * 处理 API 错误
 * @param error 错误对象
 * @param errorMessage 错误消息
 * @returns NextResponse 对象
 */
export function handleApiError(error: unknown, errorMessage: string): NextResponse {
  console.error(`${errorMessage}:`, error);
  return createErrorResponse(errorMessage);
}

/**
 * 创建 API 请求处理函数
 * @param apiUrl API URL
 * @param errorMessage 错误消息
 * @param options 请求选项
 * @returns API 请求处理函数
 */
export function createApiHandler(
  apiUrl: string, 
  errorMessage: string, 
  options: RequestInit = {}
) {
  return async function() {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      const data = await response.json();
      return createApiResponse(data, response.status);
    } catch (error) {
      return handleApiError(error, errorMessage);
    }
  };
}

/**
 * API 工具对象
 */
const apiUtils = {
  API_BASE_URL,
  BACKEND_API_URL,
  createApiResponse,
  createErrorResponse,
  handleApiError,
  createApiHandler
};

export default apiUtils;
