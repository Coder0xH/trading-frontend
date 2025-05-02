import { NextRequest, NextResponse } from 'next/server';

// 后端 API 基础 URL
const API_BASE_URL = process.env.BACKEND_API_URL ?? 'http://localhost:8000';

/**
 * 处理套利策略执行的POST请求
 * 路径格式: /api/arbitrage/[id]/execute
 * @param request - 请求对象
 * @param context - 路由上下文，包含策略ID
 * @returns NextResponse
 */
export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    // 获取策略ID
    const id = context.params.id;
    
    console.log(`正在执行套利策略: ${id}`);
    
    // 构建后端API URL
    const backendUrl = `${API_BASE_URL}/api/arbitrage/${id}/execute`;
    
    console.log(`转发POST请求到后端: ${backendUrl}`);
    
    // 调用后端API
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`后端API返回错误: ${response.status}, URL: ${backendUrl}`);
      throw new Error(`后端API返回错误: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('执行套利策略失败:', error);
    return NextResponse.json(
      { success: false, error: '执行套利策略失败' },
      { status: 500 }
    );
  }
}
