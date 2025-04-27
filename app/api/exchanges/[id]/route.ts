/**
 * 交易所ID API路由处理程序
 * 处理所有与特定交易所ID相关的HTTP请求
 */

import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

/**
 * 处理GET请求 - 获取特定交易所详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 检查请求路径是否包含api-keys
  const path = request.nextUrl.pathname;
  if (path.endsWith('/api-keys')) {
    // 如果是请求API密钥，则调用新的GET函数处理
    return getApiKeys(request, { params });
  }

  try {
    const id = params.id;
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/exchanges/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('获取交易所详情失败:', error);
    return NextResponse.json(
      { error: '获取交易所详情失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理GET请求 - 获取特定交易所的API密钥列表
 * 路径: /api/exchanges/{id}/api-keys
 */
export async function getApiKeys(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 调用后端API获取特定交易所的API密钥
    const response = await fetch(`${API_BASE_URL}/api/exchanges/${id}/api-keys`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('获取交易所API密钥列表失败:', error);
    return NextResponse.json(
      { error: '获取交易所API密钥列表失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理PUT请求 - 更新交易所
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('更新交易所失败:', error);
    return NextResponse.json(
      { error: '更新交易所失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理DELETE请求 - 删除交易所
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('删除交易所失败:', error);
    return NextResponse.json(
      { error: '删除交易所失败' },
      { status: 500 }
    );
  }
}
