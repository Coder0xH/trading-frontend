/**
 * API密钥相关类型定义
 * @author Dexter
 * @date 2025-05-18
 */

/**
 * API密钥类型
 */
export interface ApiKey {
  id: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  exchangeId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/**
 * API密钥创建参数
 */
export interface ApiKeyCreate {
  exchange_id: number;
  label: string;
  api_key: string;
  api_secret: string;
  passphrase?: string;
  is_default?: boolean;
  [key: string]: any;
}

/**
 * API密钥响应
 */
export interface ApiKeyResponse {
  id: number;
  exchange_id: number;
  label: string;
  api_key: string;
  api_key_masked?: string;
  api_secret_masked: string;
  passphrase_masked?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * 更新API密钥参数
 */
export interface UpdateApiKeyParams {
  name?: string;
  apiKey?: string;
  apiSecret?: string;
  passphrase?: string;
  [key: string]: any;
}
