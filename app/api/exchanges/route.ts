/**
 * 交易所API路由处理程序
 * 处理所有与交易所相关的HTTP请求
 */

import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

/**
 * 处理GET请求 - 获取交易所列表
 */
export async function GET(request: NextRequest) {
  try {
    // 从请求URL中获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/exchanges${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // 获取响应数据
    const data = await response.json();
    
    // 返回响应
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('获取交易所列表失败:', error);
    return NextResponse.json(
      { error: '获取交易所列表失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理POST请求 - 创建交易所
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    
    // 调用后端API
    const response = await fetch(`${API_BASE_URL}/api/exchanges`, {
      method: 'POST',
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
    console.error('创建交易所失败:', error);
    return NextResponse.json(
      { error: '创建交易所失败' },
      { status: 500 }
    );
  }
}
