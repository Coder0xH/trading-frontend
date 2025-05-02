import { NextRequest } from 'next/server';
import { BACKEND_API_URL, handleApiError, createApiResponse } from '@/lib/api-utils';

/**
 * 处理套利策略执行的POST请求
 * @param request 请求对象
 * @param context 路由上下文，包含策略ID
 * @returns API响应
 */
export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;
    const body = await request.json();
    
    // 构建后端API URL
    const backendUrl = `${BACKEND_API_URL}/api/arbitrage/${id}/execute`;
    
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
    return handleApiError(error, '执行套利策略失败');
  }
}
