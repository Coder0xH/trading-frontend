'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { 
  ExchangeResponse, 
  ApiKeyResponse, 
  ExchangeCreate,
  ApiKeyCreate,
  listExchanges,
  createExchange,
  updateExchange,
  deleteExchange,
  listApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey
} from '@/services/exchangeApi';
import { ExchangeCard } from './ExchangeCard';
import { ExchangeForm } from './ExchangeForm';
import { ApiKeyForm } from './ApiKeyForm';

/**
 * 整合交易所管理组件属性接口
 */
interface IntegratedExchangeManagerProps {
  readonly initialExchanges?: ExchangeResponse[];
  readonly initialApiKeys?: ApiKeyResponse[];
}

/**
 * 整合交易所管理组件
 * 将交易所和API密钥管理整合到一个界面中
 */
export function IntegratedExchangeManager({ 
  initialExchanges = [], 
  initialApiKeys = [] 
}: IntegratedExchangeManagerProps) {
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
      const data = await listExchanges();
      setExchanges(data);
    } catch (err) {
      console.error('获取交易所列表失败:', err);
      setError('获取交易所列表失败，请稍后重试');
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
      const data = await listApiKeys(exchangeId);
      
      // 如果提供了特定交易所ID，只更新该交易所的API密钥
      if (exchangeId) {
        setApiKeys(prevApiKeys => {
          // 移除该交易所的旧API密钥
          const filteredKeys = prevApiKeys.filter(key => key.exchange_id !== exchangeId);
          // 添加新获取的API密钥
          return [...filteredKeys, ...data];
        });
      } else {
        // 获取所有API密钥
        setApiKeys(data);
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
  
  // 初始加载数据
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  /**
   * 打开添加交易所表单
   */
  const openAddExchangeForm = () => {
    setEditingExchange(null);
    setIsExchangeFormOpen(true);
  };
  
  /**
   * 打开编辑交易所表单
   */
  const openEditExchangeForm = (exchange: ExchangeResponse) => {
    setEditingExchange(exchange);
    setIsExchangeFormOpen(true);
  };
  
  /**
   * 处理交易所表单提交
   */
  const handleExchangeSubmit = async (exchange: ExchangeCreate) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (editingExchange) {
        await updateExchange(editingExchange.id, exchange);
      } else {
        await createExchange(exchange);
      }
      
      await fetchExchanges();
    } catch (err) {
      console.error('保存交易所失败:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 处理删除交易所
   */
  const handleDeleteExchange = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteExchange(id);
      await refreshData();
    } catch (err) {
      console.error('删除交易所失败:', err);
      setError('删除交易所失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 打开添加API密钥表单
   */
  const openAddApiKeyForm = (exchangeId?: number) => {
    setEditingApiKey(null);
    setSelectedExchangeId(exchangeId ?? null);
    setIsApiKeyFormOpen(true);
  };
  
  /**
   * 打开编辑API密钥表单
   */
  const openEditApiKeyForm = (apiKey: ApiKeyResponse) => {
    setEditingApiKey(apiKey);
    setSelectedExchangeId(null);
    setIsApiKeyFormOpen(true);
  };
  
  /**
   * 处理API密钥表单提交
   */
  const handleApiKeySubmit = async (apiKey: ApiKeyCreate) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (editingApiKey) {
        await updateApiKey(editingApiKey.id, apiKey);
      } else {
        await createApiKey(apiKey, apiKey.exchange_id);
      }
      
      await fetchApiKeys();
    } catch (err) {
      console.error('保存API密钥失败:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 处理删除API密钥
   */
  const handleDeleteApiKey = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteApiKey(id);
      await fetchApiKeys();
    } catch (err) {
      console.error('删除API密钥失败:', err);
      setError('删除API密钥失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl">交易所设置</CardTitle>
            <CardDescription>
              管理您的交易所平台，API密钥和配置
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refreshData()}
              disabled={isLoading}
            >
              <RefreshCwIcon className="h-4 w-4 mr-1" />
              刷新
            </Button>
            <Button 
              size="sm" 
              onClick={openAddExchangeForm}
              disabled={isLoading}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              添加交易所
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* 加载状态 */}
          {isLoading && exchanges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              加载中...
            </div>
          )}
          
          {/* 空状态 */}
          {!isLoading && exchanges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              暂无交易所，点击上方&quot;添加交易所&quot;按钮添加
            </div>
          )}
          
          {/* 交易所列表 */}
          {exchanges.length > 0 && (
            <div>
              {exchanges.map((exchange) => (
                <ExchangeCard 
                  key={exchange.id}
                  exchange={exchange}
                  apiKeys={apiKeys.filter(key => key.exchange_id === exchange.id)}
                  onEdit={openEditExchangeForm}
                  onDelete={handleDeleteExchange}
                  onAddApiKey={(exchangeId) => openAddApiKeyForm(exchangeId)}
                  onEditApiKey={openEditApiKeyForm}
                  onDeleteApiKey={handleDeleteApiKey}
                  onRefresh={() => refreshData(exchange.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 交易所表单对话框 */}
      <ExchangeForm 
        isOpen={isExchangeFormOpen}
        onClose={() => setIsExchangeFormOpen(false)}
        onSubmit={handleExchangeSubmit}
        editingExchange={editingExchange}
        isLoading={isLoading}
      />
      
      {/* API密钥表单对话框 */}
      <ApiKeyForm 
        isOpen={isApiKeyFormOpen}
        onClose={() => setIsApiKeyFormOpen(false)}
        onSubmit={handleApiKeySubmit}
        exchanges={exchanges as ExchangeResponse[]}
        editingApiKey={editingApiKey}
        initialExchangeId={selectedExchangeId ?? undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
