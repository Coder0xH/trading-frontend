/**
 * 交易所详情API路由处理程序
 * 处理特定交易所的HTTP请求
 */

import { NextRequest } from 'next/server';
import { API_BASE_URL, handleApiError, createApiResponse } from '@/lib/api-utils';

/**
 * 处理GET请求 - 获取特定交易所详情或API密钥列表
 */
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    const path = request.nextUrl.pathname;
    
    // 检查是否请求API密钥列表
    if (path.endsWith('/api-keys')) {
      return handleApiKeysGet(id);
    }
    
    // 调用后端API获取交易所详情
    const response = await fetch(`${API_BASE_URL}/api/exchanges/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return createApiResponse(data, response.status);
  } catch (error) {
    return handleApiError(error, '获取交易所详情失败');
  }
}

/**
 * 处理API密钥列表请求
 */
async function handleApiKeysGet(id: string) {
  try {
    // 调用后端API获取交易所的API密钥列表
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
 * 处理PUT请求 - 更新交易所
 */
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    const body = await request.json();
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/exchanges/${id}`, {
      method: 'PUT',
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
    return handleApiError(error, '更新交易所失败');
  }
}

/**
 * 处理DELETE请求 - 删除交易所
 */
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/exchanges/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return createApiResponse(data, response.status);
  } catch (error) {
    return handleApiError(error, '删除交易所失败');
  }
}
