/**
 * 交易所响应类型定义
 * @author Dexter
 * @date 2025-05-18
 */

/**
 * 交易所响应类型
 */
export interface ExchangeResponse {
  id: number;
  name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * API密钥响应类型
 */
export interface ApiKeyResponse {
  id: number;
  exchange_id: number;
  name: string;
  api_key: string;
  api_secret: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * 创建交易所参数
 */
export interface ExchangeCreate {
  name: string;
  type: string;
  [key: string]: any;
}

/**
 * 创建API密钥参数
 */
export interface ApiKeyCreate {
  name: string;
  api_key: string;
  api_secret: string;
  exchange_id: number;
  [key: string]: any;
}
