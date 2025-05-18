'use client';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { ExchangeCard } from './ExchangeCard';
import { ExchangeForm } from './ExchangeForm';
import { ApiKeyForm } from './ApiKeyForm';
import { ExchangeResponse } from '@/types/exchange';
import { ApiKeyResponse } from '@/types/apiKey';
import { useExchangeManager } from '@/hooks/useExchangeManager';

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
  // 使用自定义hook管理状态
  const {
    // 状态
    exchanges,
    apiKeys,
    isLoading,
    error,
    
    // 交易所表单状态
    isExchangeFormOpen,
    setIsExchangeFormOpen,
    editingExchange,
    
    // API密钥表单状态
    isApiKeyFormOpen,
    setIsApiKeyFormOpen,
    editingApiKey,
    selectedExchangeId,
    
    // 方法
    refreshData,
    openAddExchangeForm,
    openEditExchangeForm,
    handleExchangeSubmit,
    handleDeleteExchange,
    openAddApiKeyForm,
    openEditApiKeyForm,
    handleApiKeySubmit,
    handleDeleteApiKey
  } = useExchangeManager(initialExchanges, initialApiKeys);
  
  // 所有状态和方法都已经移到useExchangeManager hook中
  
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
