/**
 * 交易所管理自定义Hook
 * @author Dexter
 * @date 2025-05-18
 */

import { useState, useEffect, useCallback } from 'react';
import { exchangeApi } from '@/api/exchanges';
import { apiKeyApi } from '@/api/apiKeys';
import { 
  ExchangeCreate, 
  ExchangeResponse, 
  ExchangeType, 
  CreateExchangeApiKeyParams 
} from '@/types/exchange';
import { ApiKeyResponse } from '@/types/apiKey';

/**
 * 交易所管理Hook
 * @param initialExchanges 初始交易所列表
 * @param initialApiKeys 初始API密钥列表
 * @returns 交易所管理状态和方法
 */
export function useExchangeManager(
  initialExchanges: ExchangeResponse[] = [],
  initialApiKeys: ApiKeyResponse[] = []
) {
  // 状态
  const [exchanges, setExchanges] = useState<readonly ExchangeResponse[]>(initialExchanges);
  const [apiKeys, setApiKeys] = useState<readonly ApiKeyResponse[]>(initialApiKeys);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 交易所表单状态
  const [isExchangeFormOpen, setIsExchangeFormOpen] = useState(false);
  const [editingExchange, setEditingExchange] = useState<ExchangeResponse | null>(null);
  
  // API密钥表单状态
  const [isApiKeyFormOpen, setIsApiKeyFormOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<ApiKeyResponse | null>(null);
  const [selectedExchangeId, setSelectedExchangeId] = useState<number | null>(null);
  
  /**
   * 加载交易所列表
   */
  const fetchExchanges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await exchangeApi.getExchanges();
      console.log('API响应数据:', response);
      
      // 判断响应是否为数组
      const exchanges = Array.isArray(response) ? response : (response?.data?.items || response?.data || []);
      
      // 确保数据存在并有效
      if (exchanges && exchanges.length > 0) {
        console.log('原始交易所数据:', exchanges);
        
        // 数据已经是正确的格式，直接使用
        if (exchanges[0].display_name && exchanges[0].exchange_type) {
          console.log('交易所数据格式正确，直接使用');
          setExchanges(exchanges as ExchangeResponse[]);
        } else {
          // 需要转换格式
          const formattedExchanges = exchanges.map(exchange => {
            console.log('处理交易所数据:', exchange);
            return {
              id: Number(exchange.id ?? 0),
              name: exchange.name ?? '',
              display_name: exchange.display_name ?? exchange.name ?? '',
              exchange_type: exchange.exchange_type ?? (exchange.type as ExchangeType) ?? ExchangeType.SPOT,
              is_active: exchange.is_active ?? exchange.status === 'active',
              created_at: exchange.created_at ?? exchange.createdAt ?? new Date().toISOString(),
              updated_at: exchange.updated_at ?? exchange.updatedAt ?? new Date().toISOString()
            };
          });
          console.log('格式化后的交易所数据:', formattedExchanges);
          setExchanges(formattedExchanges);
        }
      } else {
        console.warn('未找到交易所数据');
        setExchanges([]);
      }
    } catch (err) {
      console.error('获取交易所列表失败:', err);
      setError('获取交易所列表失败，请稍后重试');
      setExchanges([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * 加载API密钥列表
   */
  const fetchApiKeys = useCallback(async (exchangeId?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!exchangeId) {
        // 如果没有提供交易所ID，返回空数组
        setApiKeys([]);
        return;
      }
      
      const response = await apiKeyApi.getExchangeApiKeys(exchangeId.toString());
      console.log('API密钥响应数据:', response);
      
      // 判断响应是否为数组
      const apiKeys = Array.isArray(response) ? response : (response?.data?.items);
      
      console.log('原始API密钥数据:', apiKeys);
      
      // 确保数据存在并有效
      if (apiKeys && apiKeys.length > 0) {
        // 判断数据是否已经是正确的格式
        if (apiKeys[0].label && apiKeys[0].exchange_id) {
          console.log('API密钥数据格式正确，直接使用');
          // 如果提供了特定交易所ID，只更新该交易所的API密钥
          setApiKeys(prevApiKeys => {
            // 移除该交易所的旧API密钥
            const filteredKeys = prevApiKeys.filter(key => key.exchange_id !== exchangeId);
            // 添加新获取的API密钥
            return [...filteredKeys, ...apiKeys];
          });
        } else {
          // 需要转换格式
          const formattedApiKeys = apiKeys.map(apiKey => {
            console.log('处理API密钥数据:', apiKey);
            return {
              id: Number(apiKey.id ?? 0),
              exchange_id: Number(apiKey.exchange_id ?? apiKey.exchangeId ?? exchangeId),
              label: apiKey.label ?? apiKey.name ?? '',
              api_key: apiKey.api_key ?? apiKey.apiKey ?? '',
              api_key_masked: apiKey.api_key_masked ?? (apiKey.apiKey ? `${apiKey.apiKey.substring(0, 4)}****${apiKey.apiKey.substring(apiKey.apiKey.length - 4)}` : '********'),
              api_secret_masked: apiKey.api_secret_masked ?? '********',
              is_default: apiKey.is_default ?? true,
              created_at: apiKey.created_at ?? apiKey.createdAt ?? new Date().toISOString(),
              updated_at: apiKey.updated_at ?? apiKey.updatedAt ?? new Date().toISOString()
            };
          });
          
          console.log('格式化后的API密钥数据:', formattedApiKeys);
          
          // 如果提供了特定交易所ID，只更新该交易所的API密钥
          setApiKeys(prevApiKeys => {
            // 移除该交易所的旧API密钥
            const filteredKeys = prevApiKeys.filter(key => key.exchange_id !== exchangeId);
            // 添加新获取的API密钥
            return [...filteredKeys, ...formattedApiKeys];
          });
        }
      } else {
        console.warn('未找到API密钥数据');
        // 不清除其他交易所的API密钥
        setApiKeys(prevApiKeys => {
          return prevApiKeys.filter(key => key.exchange_id !== exchangeId);
        });
      }
    } catch (err) {
      console.error('获取API密钥列表失败:', err);
      setError('获取API密钥列表失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * 刷新所有数据
   */
  const refreshData = useCallback(async (exchangeId?: number) => {
    if (exchangeId) {
      // 只刷新特定交易所的API密钥
      await fetchApiKeys(exchangeId);
    } else {
      // 刷新所有数据
      await Promise.all([fetchExchanges(), fetchApiKeys()]);
    }
  }, [fetchExchanges, fetchApiKeys]);
  
  /**
   * 打开添加交易所表单
   */
  const openAddExchangeForm = useCallback(() => {
    setEditingExchange(null);
    setIsExchangeFormOpen(true);
  }, []);
  
  /**
   * 打开编辑交易所表单
   */
  const openEditExchangeForm = useCallback((exchange: ExchangeResponse) => {
    setEditingExchange(exchange);
    setIsExchangeFormOpen(true);
  }, []);
  
  /**
   * 处理交易所表单提交
   */
  const handleExchangeSubmit = useCallback(async (exchange: ExchangeCreate) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('提交交易所数据:', exchange);
      
      // 将旧API的参数转换为新API的格式
      const newExchangeData = {
        name: exchange.name,
        display_name: exchange.display_name,
        exchange_type: exchange.exchange_type,
        is_active: exchange.is_active
      };
      
      console.log('发送到后端的交易所数据:', newExchangeData);
      
      if (editingExchange) {
        await exchangeApi.updateExchange(editingExchange.id.toString(), newExchangeData);
      } else {
        await exchangeApi.createExchange(newExchangeData);
      }
      
      await fetchExchanges();
      setIsExchangeFormOpen(false);
      setEditingExchange(null);
    } catch (err: any) {
      console.error('保存交易所失败:', err);
      const errorMsg = err.response?.data?.detail ?? err.message ?? '保存交易所失败，请稍后重试';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [editingExchange, fetchExchanges]);
  
  /**
   * 处理删除交易所
   */
  const handleDeleteExchange = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await exchangeApi.deleteExchange(id.toString());
      await refreshData();
    } catch (err) {
      console.error('删除交易所失败:', err);
      setError('删除交易所失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [refreshData]);
  
  /**
   * 打开添加API密钥表单
   */
  const openAddApiKeyForm = useCallback((exchangeId?: number) => {
    setEditingApiKey(null);
    setSelectedExchangeId(exchangeId ?? null);
    setIsApiKeyFormOpen(true);
  }, []);
  
  /**
   * 打开编辑API密钥表单
   */
  const openEditApiKeyForm = useCallback((apiKey: ApiKeyResponse) => {
    setEditingApiKey(apiKey);
    setSelectedExchangeId(null);
    setIsApiKeyFormOpen(true);
  }, []);
  
  /**
   * 处理API密钥表单提交
   */
  const handleApiKeySubmit = useCallback(async (apiKey: CreateExchangeApiKeyParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 将API参数转换为后端期望的格式
      const newApiKeyData = {
        exchange_id: apiKey.exchange_id,
        label: apiKey.label,
        api_key: apiKey.api_key,
        api_secret: apiKey.api_secret,
        passphrase: apiKey.passphrase ?? undefined,
        is_default: apiKey.is_default ?? false,
        is_testnet: apiKey.is_testnet ?? false,
        can_trade: apiKey.can_trade ?? true,
        can_withdraw: apiKey.can_withdraw ?? false
      };
      
      if (editingApiKey) {
        await apiKeyApi.updateApiKey(editingApiKey.id.toString(), newApiKeyData);
      } else {
        await apiKeyApi.createExchangeApiKey(apiKey.exchange_id.toString(), newApiKeyData);
      }
      
      await fetchApiKeys(apiKey.exchange_id);
      setIsApiKeyFormOpen(false);
      setEditingApiKey(null);
    } catch (err) {
      console.error('保存API密钥失败:', err);
      setError('保存API密钥失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [editingApiKey, fetchApiKeys]);
  
  /**
   * 处理删除API密钥
   */
  const handleDeleteApiKey = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiKeyApi.deleteApiKey(id.toString());
      await fetchApiKeys();
    } catch (err) {
      console.error('删除API密钥失败:', err);
      setError('删除API密钥失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [fetchApiKeys]);
  
  // 初始加载数据
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  return {
    // 状态
    exchanges,
    // API密钥列表
    apiKeys,
    // 加载状态
    isLoading,
    // 错误信息
    error,
    
    // 交易所表单状态
    isExchangeFormOpen,
    // 设置交易所表单打开状态
    setIsExchangeFormOpen,
    // 编辑中的交易所
    editingExchange,
    
    // API密钥表单状态
    isApiKeyFormOpen,
    // 设置API密钥表单打开状态
    setIsApiKeyFormOpen,
    // 编辑中的API密钥
    editingApiKey,
    // 选中的交易所ID
    selectedExchangeId,
    
    // 方法
    refreshData,
    // 打开添加交易所表单
    openAddExchangeForm,
    // 打开编辑交易所表单
    openEditExchangeForm,
    // 添加或更新交易所
    handleExchangeSubmit,
    // 删除交易所
    handleDeleteExchange,
    // 打开添加API密钥表单
    openAddApiKeyForm,
    // 打开编辑API密钥表单
    openEditApiKeyForm,
    // 添加或更新API密钥
    handleApiKeySubmit,
    // 删除API密钥
    handleDeleteApiKey
  };
}

export default useExchangeManager;
