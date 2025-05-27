/**
 * Token API服务
 * 用于与后端API交互，获取代币相关数据
 * @author Dexter
 * @date 2025-05-27
 */

import { request, ApiResponse } from '@/lib/request';
import { BinanceTokenResponse, SyncRequest, SyncResponse, SyncStatusResponse, TokenCreateParams, TokenUpdateParams } from '@/types/token';

/**
 * Token API服务
 */
export const tokenApi = {
  /**
   * 获取代币统计信息
   * @returns 代币统计信息
   */
  getTokenStats: async () => {
    return request.get('/tokens/stats');
  },

  /**
   * 获取代币列表
   * @param skip 跳过的记录数
   * @param limit 返回的记录数
   * @param symbol 代币符号
   * @param hasContract 是否有合约地址
   * @param hasUsdtPair 是否有USDT交易对
   * @returns 代币列表
   */
  getTokens: async (
    skip = 0,
    limit = 100,
    symbol?: string,
    hasContract?: boolean,
    hasUsdtPair?: boolean
  ): Promise<ApiResponse<BinanceTokenResponse[]>> => {
    const params: Record<string, any> = { skip, limit };
    
    if (symbol) params.symbol = symbol;
    if (hasContract !== undefined) params.has_contract = hasContract;
    if (hasUsdtPair !== undefined) params.has_usdt_pair = hasUsdtPair;
    
    return request.get('/tokens', { params });
  },

  /**
   * 获取有USDT交易对的代币列表
   * @param skip 跳过的记录数
   * @param limit 返回的记录数
   * @returns 有USDT交易对的代币列表
   */
  getTokensWithUsdtPairs: async (
    skip = 0,
    limit = 100
  ): Promise<ApiResponse<BinanceTokenResponse[]>> => {
    return request.get('/tokens/usdt-pairs', { params: { skip, limit } });
  },

  /**
   * 根据ID获取代币详情
   * @param tokenId 代币ID
   * @returns 代币详情
   */
  getTokenById: async (tokenId: number): Promise<ApiResponse<BinanceTokenResponse>> => {
    return request.get(`/tokens/${tokenId}`);
  },

  /**
   * 根据符号获取代币详情
   * @param symbol 代币符号
   * @returns 代币详情
   */
  getTokenBySymbol: async (symbol: string): Promise<ApiResponse<BinanceTokenResponse>> => {
    return request.get(`/tokens/symbol/${symbol}`);
  },

  /**
   * 根据合约地址获取代币
   * @param address 合约地址
   * @returns 代币列表
   */
  getTokensByContract: async (address: string): Promise<ApiResponse<BinanceTokenResponse[]>> => {
    return request.get(`/tokens/contract/${address}`);
  },

  /**
   * 同步交易所代币信息
   * @param syncRequest 同步请求
   * @returns 同步响应
   */
  syncExchangeTokens: async (syncRequest: SyncRequest = { limit: 100, force_update: false }): Promise<ApiResponse<SyncResponse>> => {
    return request.post('/sync/tokens', syncRequest);
  },


  /**
   * 同步USDT交易对信息
   * @returns 同步响应
   */
  syncUsdtTradingPairs: async (): Promise<ApiResponse<SyncResponse>> => {
    return request.post('/sync/usdt-pairs');
  },

  /**
   * 获取代币同步状态
   * @returns 同步状态响应
   */
  getTokensSyncStatus: async (): Promise<ApiResponse<SyncStatusResponse>> => {
    return request.get('/sync/tokens/status');
  },

  /**
   * 创建新代币
   * @param data 代币创建数据
   * @returns 创建的代币信息
   */
  createToken: async (data: TokenCreateParams): Promise<ApiResponse<BinanceTokenResponse>> => {
    return request.post('/tokens', data);
  },

  /**
   * 更新代币信息
   * @param tokenId 代币ID
   * @param data 代币更新数据
   * @returns 更新后的代币信息
   */
  updateToken: async (tokenId: number, data: TokenUpdateParams): Promise<ApiResponse<BinanceTokenResponse>> => {
    return request.put(`/tokens/${tokenId}`, data);
  },

  /**
   * 删除代币
   * @param tokenId 代币ID
   * @returns 删除结果
   */
  deleteToken: async (tokenId: number): Promise<ApiResponse<{id: number, coin: string}>> => {
    return request.delete(`/tokens/${tokenId}`);
  }
};

export default tokenApi;
