/**
 * 交易所API密钥API路由处理程序
 * 处理特定交易所的API密钥相关的HTTP请求
 */

import { NextRequest } from 'next/server';
import { API_BASE_URL, handleApiError, createApiResponse } from '@/lib/api-utils';

/**
 * 处理GET请求 - 获取特定交易所的API密钥列表
 */
export async function GET(
  context: any
) {
  try {
    const id = context.params.id;
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/exchanges/${id}/api-keys`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return createApiResponse(data, response.status);
  } catch (error) {
    return handleApiError(error, '获取交易所API密钥列表失败');
  }
}

/**
 * 处理POST请求 - 为特定交易所创建API密钥
 */
export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    const body = await request.json();
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/exchanges/${id}/api-keys`, {
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
    return handleApiError(error, '创建交易所API密钥失败');
  }
}
