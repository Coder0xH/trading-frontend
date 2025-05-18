/**
 * API密钥API服务
 * 整合所有API密钥相关的API调用
 * @author Dexter
 * @date 2025-05-18
 */

import { request, ApiResponse, ApiListResponse } from '@/lib/request';
import { CreateExchangeApiKeyParams } from '@/types/exchange';
import { ApiKey, UpdateApiKeyParams } from '@/types/apiKey';

/**
 * API密钥API服务
 */
export const apiKeyApi = {
  /**
   * 获取交易所的API密钥列表
   * @param exchangeId 交易所ID
   * @param params 查询参数
   * @returns API密钥列表
   */
  getExchangeApiKeys: async (exchangeId: string, params?: Record<string, any>) => {
    return request.get<ApiListResponse<ApiKey>>(`/exchanges/${exchangeId}/api-keys`, params);
  },

  /**
   * 为交易所创建API密钥
   * @param exchangeId 交易所ID
   * @param data API密钥数据
   * @returns 创建的API密钥ID
   */
  createExchangeApiKey: async (exchangeId: string, data: CreateExchangeApiKeyParams) => {
    return request.post<string>(`/exchanges/${exchangeId}/api-keys`, data);
  },

  /**
   * 更新API密钥
   * @param id API密钥ID
   * @param data 更新数据
   * @returns 更新结果
   */
  updateApiKey: async (id: string, data: UpdateApiKeyParams) => {
    return request.put<ApiResponse<null>>(`/exchanges/api-keys/${id}`, data);
  },

  /**
   * 删除API密钥
   * @param id API密钥ID
   * @returns 删除结果
   */
  deleteApiKey: async (id: string) => {
    return request.delete<ApiResponse<null>>(`/exchanges/api-keys/${id}`);
  }
};

export default apiKeyApi;