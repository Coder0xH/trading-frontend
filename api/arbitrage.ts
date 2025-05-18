/**
 * 套利策略API服务
 * 整合所有套利策略相关的API调用
 * @author Dexter
 * @date 2025-05-18
 */

import { request, ApiResponse, ApiListResponse } from '@/lib/request';
import { ArbitrageStrategy, CreateArbitrageParams } from '@/types/arbitrage';

/**
 * 套利策略API服务
 */
export const arbitrageApi = {
  /**
   * 获取套利策略列表
   * @param params 查询参数
   * @returns 套利策略列表
   */
  getStrategies: async (params?: { enabled?: boolean; skip?: number; limit?: number }) => {
    return request.get<ApiListResponse<ArbitrageStrategy>>('/arbitrage', { params });
  },

  /**
   * 获取套利策略详情
   * @param id 策略ID
   * @returns 套利策略详情
   */
  getStrategyById: async (id: string) => {
    return request.get<ApiResponse<ArbitrageStrategy>>(`/arbitrage/${id}`);
  },

  /**
   * 创建套利策略
   * @param data 策略数据
   * @returns 创建结果
   */
  createStrategy: async (data: CreateArbitrageParams) => {
    return request.post<ApiResponse<ArbitrageStrategy>>('/arbitrage', data);
  },

  /**
   * 更新套利策略
   * @param id 策略ID
   * @param data 更新数据
   * @returns 更新结果
   */
  updateStrategy: async (id: string, data: Partial<CreateArbitrageParams>) => {
    return request.put<ApiResponse<ArbitrageStrategy>>(`/arbitrage/${id}`, data);
  },

  /**
   * 删除套利策略
   * @param id 策略ID
   * @returns 删除结果
   */
  deleteStrategy: async (id: string) => {
    return request.delete<ApiResponse<{ success: boolean }>>(`/arbitrage/${id}`);
  },

  /**
   * 执行套利策略
   * @param id 策略ID
   * @returns 执行结果
   */
  executeStrategy: async (id: string) => {
    return request.post<ApiResponse<any>>(`/arbitrage/${id}/execute`);
  },

  /**
   * 获取策略执行记录
   * @param id 策略ID
   * @param params 查询参数
   * @returns 执行记录列表
   */
  getStrategyExecutions: async (id: string, params?: { limit?: number; offset?: number }) => {
    return request.get<ApiListResponse<any>>(`/arbitrage/${id}/executions`, { params });
  },

  /**
   * 获取执行详情
   * @param id 执行ID
   * @returns 执行详情
   */
  getExecutionDetails: async (id: string) => {
    return request.get<ApiResponse<any>>(`/arbitrage/executions/${id}`);
  }
};

export default arbitrageApi;