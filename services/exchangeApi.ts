/**
 * 交易所 API 服务
 * 提供与交易所和API密钥相关的所有 API 调用
 */

// API 基础 URL - 使用相对路径，由Next.js处理
const API_BASE_URL = '';

/**
 * 交易所类型枚举
 */
export enum ExchangeType {
  SPOT = 'spot',
  FUTURES = 'futures',
  BOTH = 'both'
}

/**
 * 交易所创建接口
 */
export interface ExchangeCreate {
  name: string;
  display_name: string;
  exchange_type: ExchangeType;
  is_active: boolean;
}

/**
 * 交易所响应接口
 */
export interface ExchangeResponse {
  id: number;
  name: string;
  display_name: string;
  exchange_type: ExchangeType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * API密钥创建接口
 */
export interface ApiKeyCreate {
  exchange_id: number;
  label: string;
  api_key: string;
  api_secret: string;
  passphrase?: string;
  is_default?: boolean;
}

/**
 * API密钥响应接口
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
}

/**
 * 获取交易所列表
 * @returns 交易所列表
 */
export const listExchanges = async (): Promise<ExchangeResponse[]> => {
  try {
    const response = await fetch(`/api/exchanges`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('获取交易所列表失败:', error);
    throw error;
  }
};

/**
 * 创建交易所
 * @param exchange - 交易所信息
 * @returns 创建结果
 */
export const createExchange = async (exchange: ExchangeCreate): Promise<ExchangeResponse> => {
  try {
    const response = await fetch(`/api/exchanges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exchange),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('创建交易所失败:', error);
    throw error;
  }
};

/**
 * 更新交易所
 * @param id - 交易所ID
 * @param exchange - 交易所信息
 * @returns 更新结果
 */
export const updateExchange = async (id: number, exchange: Partial<ExchangeCreate>): Promise<ExchangeResponse> => {
  try {
    const response = await fetch(`/api/exchanges/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exchange),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`更新交易所 ${id} 失败:`, error);
    throw error;
  }
};

/**
 * 删除交易所
 * @param id - 交易所ID
 * @returns 删除结果
 */
export const deleteExchange = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`/api/exchanges/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`删除交易所 ${id} 失败:`, error);
    throw error;
  }
};

/**
 * 获取API密钥列表
 * @param exchangeId - 可选，交易所ID
 * @returns API密钥列表
 */
export const listApiKeys = async (exchangeId?: number): Promise<ApiKeyResponse[]> => {
  try {
    // 如果提供了exchangeId，使用交易所特定的API路径
    // 否则使用查询参数方式
    const url = exchangeId 
      ? `/api/exchanges/${exchangeId}/api-keys` 
      : `/api/exchanges/1/api-keys`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('获取API密钥列表失败:', error);
    throw error;
  }
};

/**
 * 创建API密钥
 * @param apiKey - API密钥信息
 * @param exchangeId - 交易所ID
 * @returns 创建结果
 */
export const createApiKey = async (apiKey: ApiKeyCreate, exchangeId?: number): Promise<ApiKeyResponse> => {
  try {
    const url = exchangeId 
      ? `/api/exchanges/${exchangeId}/api-keys` 
      : `/api/api-keys`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKey),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('创建API密钥失败:', error);
    throw error;
  }
};

/**
 * 更新API密钥
 * @param id - API密钥ID
 * @param apiKey - API密钥信息
 * @returns 更新结果
 */
export const updateApiKey = async (id: number, apiKey: Partial<ApiKeyCreate>): Promise<ApiKeyResponse> => {
  try {
    const response = await fetch(`/api/api-keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKey),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`更新API密钥 ${id} 失败:`, error);
    throw error;
  }
};

/**
 * 删除API密钥
 * @param id - API密钥ID
 * @returns 删除结果
 */
export const deleteApiKey = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`/api/api-keys/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`删除API密钥 ${id} 失败:`, error);
    throw error;
  }
};
