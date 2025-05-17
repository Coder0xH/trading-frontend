import { NextRequest } from 'next/server';
import { BACKEND_API_URL, handleApiError, createApiResponse } from '@/lib/api-utils';

/**
 * 处理所有套利策略相关的API请求
 */

/**
 * 处理GET请求 - 获取套利策略列表或特定策略详情
 * @param request 请求对象
 * @returns API响应
 */
export async function GET(request: NextRequest) {
  try {
    // 获取请求路径和查询参数
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    
    // 构建后端API URL
    let backendUrl = `${BACKEND_API_URL}/api/arbitrage${path}`;
    if (url.search) {
      backendUrl += url.search;
    }
    
    // 调用后端API
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return createApiResponse(data, response.status);
  } catch (error) {
    return handleApiError(error, '获取套利策略数据失败');
  }
}

/**
 * 处理POST请求 - 创建新的套利策略
 * @param request 请求对象
 * @returns API响应
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求路径和请求体
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    const body = await request.json();
    
    // 构建后端API URL
    const backendUrl = `${BACKEND_API_URL}/api/arbitrage${path}`;
    
    // 调用后端API
    const response = await fetch(backendUrl, {
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
    return handleApiError(error, '创建套利策略失败');
  }
}

/**
 * 处理PUT请求 - 更新套利策略
 * @param request 请求对象
 * @returns API响应
 */
export async function PUT(request: NextRequest) {
  try {
    // 获取请求路径和请求体
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    const body = await request.json();
    
    // 构建后端API URL
    const backendUrl = `${BACKEND_API_URL}/api/arbitrage${path}`;
    
    // 调用后端API
    const response = await fetch(backendUrl, {
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
    return handleApiError(error, '更新套利策略失败');
  }
}

/**
 * 处理DELETE请求 - 删除套利策略
 * @param request 请求对象
 * @returns API响应
 */
export async function DELETE(request: NextRequest) {
  try {
    // 获取请求路径
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    
    // 构建后端API URL
    const backendUrl = `${BACKEND_API_URL}/api/arbitrage${path}`;
    
    // 调用后端API
    const response = await fetch(backendUrl, {
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
    return handleApiError(error, '删除套利策略失败');
  }
}
