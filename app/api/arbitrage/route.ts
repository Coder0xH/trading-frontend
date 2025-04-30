import { NextRequest, NextResponse } from 'next/server';

// 后端 API 基础 URL
const API_BASE_URL = process.env.BACKEND_API_URL ?? 'http://localhost:8000';

/**
 * 处理所有套利策略相关的API请求
 * 根据请求路径和方法转发到后端API
 */
export async function GET(request: NextRequest) {
  try {
    // 获取完整路径
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    const searchParams = url.searchParams.toString();
    
    // 构建后端API URL
    let backendUrl = `${API_BASE_URL}/api/arbitrage${path}`;
    if (searchParams) {
      backendUrl = `${backendUrl}?${searchParams}`;
    }
    
    // 调用后端API
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`后端API返回错误: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('套利策略API请求失败:', error);
    return NextResponse.json(
      { success: false, error: '套利策略API请求失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理POST请求
 * 支持动态路径如 /api/arbitrage/1/execute
 */
export async function POST(request: NextRequest) {
  try {
    // 获取完整路径
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    
    // 获取请求体 (如果有)
    let body = {};
    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await request.json();
      }
    } catch (e) {
      // 请求可能没有body，忽略错误
      console.error('解析请求体失败:', e);
    }
    
    // 构建后端API URL
    const backendUrl = `${API_BASE_URL}/api/arbitrage${path}`;
    
    console.log(`转发POST请求到后端: ${backendUrl}`);
    
    // 调用后端API
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      console.error(`后端API返回错误: ${response.status}, URL: ${backendUrl}`);
      throw new Error(`后端API返回错误: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('套利策略API请求失败:', error);
    return NextResponse.json(
      { success: false, error: '套利策略API请求失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理PUT请求
 */
export async function PUT(request: NextRequest) {
  try {
    // 获取完整路径
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    
    // 获取请求体
    const body = await request.json();
    
    // 构建后端API URL
    const backendUrl = `${API_BASE_URL}/api/arbitrage${path}`;
    
    // 调用后端API
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`后端API返回错误: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('套利策略API请求失败:', error);
    return NextResponse.json(
      { success: false, error: '套利策略API请求失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理DELETE请求
 */
export async function DELETE(request: NextRequest) {
  try {
    // 获取完整路径
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/arbitrage', '');
    
    // 构建后端API URL
    const backendUrl = `${API_BASE_URL}/api/arbitrage${path}`;
    
    // 调用后端API
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`后端API返回错误: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('套利策略API请求失败:', error);
    return NextResponse.json(
      { success: false, error: '套利策略API请求失败' },
      { status: 500 }
    );
  }
}
