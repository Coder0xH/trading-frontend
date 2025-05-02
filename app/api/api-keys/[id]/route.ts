/**
 * API密钥详情API路由处理程序
 * 处理特定API密钥的HTTP请求
 */

import { NextRequest } from 'next/server';
import { API_BASE_URL, handleApiError, createApiResponse } from '@/lib/api-utils';

/**
 * 处理GET请求 - 获取特定API密钥详情
 */
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/api-keys/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return createApiResponse(data, response.status);
  } catch (error) {
    return handleApiError(error, '获取API密钥详情失败');
  }
}

/**
 * 处理PUT请求 - 更新API密钥
 */
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    const body = await request.json();
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/api-keys/${id}`, {
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
    return handleApiError(error, '更新API密钥失败');
  }
}

/**
 * 处理DELETE请求 - 删除API密钥
 */
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/api-keys/${id}`, {
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
    return handleApiError(error, '删除API密钥失败');
  }
}
