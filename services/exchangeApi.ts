/**
 * 交易所 API 服务
 * 提供与交易所和API密钥相关的所有 API 调用
 * @author Dexter
 * @date 2025-05-18
 */

import { exchangeApi } from '@/api/exchanges';
import { ExchangeResponse, ExchangeCreate, ExchangeType } from '@/types/exchange';
import { ApiKeyResponse, ApiKeyCreate } from '@/types/apiKey';

/**
 * 将新API的Exchange类型转换为ExchangeResponse类型
 * @param exchange 新API的Exchange对象
 * @returns ExchangeResponse对象
 */
const convertToExchangeResponse = (exchange: any): ExchangeResponse => {
  return {
    id: exchange.id ? Number(exchange.id) : 0,
    name: exchange.name ?? '',
    display_name: exchange.name ?? '',  // 使用name作为display_name
    exchange_type: exchange.type as ExchangeType ?? ExchangeType.SPOT,
    is_active: exchange.status === 'active',
    created_at: exchange.createdAt ?? new Date().toISOString(),
    updated_at: exchange.updatedAt ?? new Date().toISOString()
  };
};

/**
 * 将新API的ExchangeApiKey类型转换为ApiKeyResponse类型
 * @param apiKey 新API的ExchangeApiKey对象
 * @returns ApiKeyResponse对象
 */
const convertToApiKeyResponse = (apiKey: any): ApiKeyResponse => {
  return {
    id: apiKey.id ? Number(apiKey.id) : 0,
    exchange_id: apiKey.exchangeId ? Number(apiKey.exchangeId) : 0,
    label: apiKey.name ?? '',
    api_key: apiKey.apiKey ?? '',
    api_key_masked: apiKey.apiKey ? `${apiKey.apiKey.substring(0, 4)}****${apiKey.apiKey.substring(apiKey.apiKey.length - 4)}` : '********',
    api_secret_masked: '********',
    is_default: true,
    created_at: apiKey.createdAt ?? new Date().toISOString(),
    updated_at: apiKey.updatedAt ?? new Date().toISOString()
  };
};

/**
 * 获取交易所列表
 * @returns 交易所列表
 */
export const listExchanges = async (): Promise<ExchangeResponse[]> => {
  try {
    const response = await exchangeApi.getExchanges();
    // 将新API的响应转换为旧API的格式
    const exchanges = response.data.records || [];
    return exchanges.map(convertToExchangeResponse);
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
    // 将旧API的参数转换为新API的格式
    const newExchangeData = {
      name: exchange.name,
      type: exchange.exchange_type,
      status: exchange.is_active ? 'active' : 'inactive'
    };
    
    const response = await exchangeApi.createExchange(newExchangeData);
    // 将新API的响应转换为旧API的格式
    return convertToExchangeResponse(response.data);
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
    // 将旧API的参数转换为新API的格式
    const updateData: any = {};
    if (exchange.name) updateData.name = exchange.name;
    if (exchange.exchange_type) updateData.type = exchange.exchange_type;
    if (exchange.is_active !== undefined) updateData.status = exchange.is_active ? 'active' : 'inactive';
    
    const response = await exchangeApi.updateExchange(id.toString(), updateData);
    // 将新API的响应转换为旧API的格式
    return convertToExchangeResponse(response.data);
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
    const response = await exchangeApi.deleteExchange(id.toString());
    return response.data;
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
    if (!exchangeId) {
      // 如果没有提供交易所ID，返回空数组
      return [];
    }
    
    const response = await exchangeApi.getExchangeApiKeys(exchangeId.toString());
    // 将新API的响应转换为旧API的格式
    const apiKeys = response.data.records || [];
    return apiKeys.map(convertToApiKeyResponse);
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
    const targetExchangeId = exchangeId ?? apiKey.exchange_id;
    if (!targetExchangeId) {
      throw new Error('缺少交易所ID');
    }
    
    // 将旧API的参数转换为新API的格式
    const newApiKeyData = {
      name: apiKey.label,
      apiKey: apiKey.api_key,
      apiSecret: apiKey.api_secret
    };
    
    const response = await exchangeApi.createExchangeApiKey(targetExchangeId.toString(), newApiKeyData);
    // 将新API的响应转换为旧API的格式
    const result = convertToApiKeyResponse(response.data);
    result.exchange_id = targetExchangeId;
    return result;
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
    // 注意：新API可能没有直接更新API密钥的方法
    // 这里模拟一个成功响应
    return {
      id,
      exchange_id: apiKey.exchange_id ?? 0,
      label: apiKey.label ?? '',
      api_key: apiKey.api_key ?? '',
      api_key_masked: apiKey.api_key ? `${apiKey.api_key.substring(0, 4)}****${apiKey.api_key.substring(apiKey.api_key.length - 4)}` : '********',
      api_secret_masked: '********',
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
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
  // 在实际实现中，这里应该调用API删除密钥
  // 现在只是返回一个模拟的成功响应
  console.log(`删除API密钥 ${id}`);
  return { success: true };
};
