/**
 * 交易所API密钥路由处理程序
 * 处理特定交易所的API密钥相关请求
 */

import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

/**
 * 处理GET请求 - 获取特定交易所的API密钥列表
 */
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    // 确保params是已解析的
    const { id } = context.params;
    
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
 * 处理POST请求 - 为特定交易所创建API密钥
 */
export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    // 确保params是已解析的
    const { id } = context.params;
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('创建交易所API密钥失败:', error);
    return NextResponse.json(
      { error: '创建交易所API密钥失败' },
      { status: 500 }
    );
  }
}
