/**
 * API密钥API路由处理程序
 * 处理所有与API密钥相关的HTTP请求
 */

import { NextRequest } from 'next/server';
import { API_BASE_URL, handleApiError, createApiResponse } from '@/lib/api-utils';

/**
 * 处理GET请求 - 获取API密钥列表
 */
export async function GET(request: NextRequest) {
  try {
    // 从请求URL中获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const exchangeId = searchParams.get('exchangeId');
    
    // 根据是否有exchangeId参数构建不同的API URL
    let apiUrl = `${API_BASE_URL}/api/api-keys`;
    if (exchangeId) {
      apiUrl = `${API_BASE_URL}/api/exchanges/${exchangeId}/api-keys`;
    }
    
    // 构建其他查询参数
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    // 调用后端API
    const response = await fetch(`${apiUrl}${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return createApiResponse(data, response.status);
  } catch (error) {
    return handleApiError(error, '获取API密钥列表失败');
  }
}

/**
 * 处理POST请求 - 创建API密钥
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return createApiResponse(data, response.status);
  } catch (error) {
    return handleApiError(error, '创建API密钥失败');
  }
}
