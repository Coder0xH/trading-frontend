/**
 * 交易所相关类型定义
 * @author Dexter
 * @date 2025-05-18
 */

/**
 * 交易所类型枚举
 */
export enum ExchangeType {
  SPOT = 'spot',
  FUTURES = 'futures',
  BOTH = 'both',
  DEX = 'dex'
}

/**
 * 交易所类型
 */
export interface Exchange {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/**
 * 交易所创建参数
 */
export interface ExchangeCreate {
  name: string;
  display_name: string;
  exchange_type: ExchangeType;
  is_active: boolean;
}

/**
 * 交易所响应
 */
export interface ExchangeResponse {
  id: number;
  name: string;
  display_name: string;
  exchange_type: ExchangeType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * 交易所API密钥类型
 */
export interface ExchangeApiKey {
  id: string;
  exchangeId: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/**
 * 创建交易所参数
 */
export interface CreateExchangeParams {
  name: string;
  type: string;
  display_name: string;
  exchange_type: ExchangeType;
  is_active: boolean;
  [key: string]: any;
}

/**
 * 更新交易所参数
 */
export interface UpdateExchangeParams {
  name?: string;
  type?: string;
  status?: string;
  [key: string]: any;
}

/**
 * 创建交易所API密钥参数
 */
export interface CreateExchangeApiKeyParams {
  name: string;
  apiKey: string;
  apiSecret: string;
  [key: string]: any;
}
