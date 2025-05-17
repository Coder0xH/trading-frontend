/**
 * 交易所API服务
 * 整合所有交易所相关的API调用
 * @author Dexter
 * @date 2025-05-18
 */
import { request, ApiResponse, ApiListResponse } from '@/lib/request';
import {
  Exchange,
  ExchangeApiKey,
  UpdateExchangeParams,
  CreateExchangeApiKeyParams
} from '@/types/exchange';

/**
 * 交易所API服务
 */
export const exchangeApi = {
  /**
   * 获取交易所列表
   * @param params 查询参数
   * @returns 交易所列表
   */
  getExchanges: async (params?: Record<string, any>) => {
    return request.get<ApiListResponse<Exchange>>('/exchanges', params);
  },

  /**
   * 创建交易所
   * @param data 交易所数据
   * @returns 创建的交易所ID
   */
  createExchange: async (data: any) => {
    return request.post<string>('/exchanges', data);
  },

  /**
   * 获取交易所详情
   * @param id 交易所ID
   * @returns 交易所详情
   */
  getExchangeById: async (id: string) => {
    return request.get<Exchange>(`/exchanges/${id}`);
  },

  /**
   * 更新交易所
   * @param id 交易所ID
   * @param data 更新数据
   * @returns 更新结果
   */
  updateExchange: async (id: string, data: UpdateExchangeParams) => {
    return request.put<ApiResponse<null>>(`/exchanges/${id}`, data);
  },

  /**
   * 删除交易所
   * @param id 交易所ID
   * @returns 删除结果
   */
  deleteExchange: async (id: string) => {
    return request.delete<ApiResponse<null>>(`/exchanges/${id}`);
  },

  /**
   * 获取交易所API密钥列表
   * @param exchangeId 交易所ID
   * @returns API密钥列表
   */
  getExchangeApiKeys: async (exchangeId: string) => {
    return request.get<ApiListResponse<ExchangeApiKey>>(`/exchanges/${exchangeId}/api-keys`);
  },

  /**
   * 创建交易所API密钥
   * @param exchangeId 交易所ID
   * @param data API密钥数据
   * @returns 创建的API密钥ID
   */
  createExchangeApiKey: async (exchangeId: string, data: CreateExchangeApiKeyParams) => {
    return request.post<string>(`/exchanges/${exchangeId}/api-keys`, data);
  },

  /**
   * 删除交易所API密钥
   * @param exchangeId 交易所ID
   * @param apiKeyId API密钥ID
   * @returns 删除结果
   */
  deleteExchangeApiKey: async (exchangeId: string, apiKeyId: string) => {
    return request.delete<ApiResponse<null>>(`/exchanges/${exchangeId}/api-keys/${apiKeyId}`);
  }
};

export default exchangeApi;