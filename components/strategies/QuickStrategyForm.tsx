'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  ArbitrageStrategyConfig,
  ArbitrageDirection,
  TradeMode,
  HedgeType,
  PoolSize
} from '@/types/arbitrage';
import arbitrageApi from '@/api/arbitrage';
import { apiKeyApi } from '@/api/apiKeys';
import { exchangeApi } from '@/api/exchanges';
import { ApiKey } from '@/types/apiKey';
import { Exchange } from '@/types/exchange';
import { Loader2 } from 'lucide-react';

// 导入子组件
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ExchangeSection } from './sections/ExchangeSection';
import { TradeParamsSection } from './sections/TradeParamsSection';
import { AdvancedSettingsSection } from './sections/AdvancedSettingsSection';

interface QuickStrategyFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  opportunityData?: {
    id: string;
    symbol: string;
    buyExchange: string;
    sellExchange: string;
    buyPrice: number;
    sellPrice: number;
    priceDifference: number;
    priceDifferencePercentage: number;
    chain: string;
    [key: string]: string | number | boolean | undefined;
  } | null;
}

// 链ID映射
const CHAIN_ID_MAP: Record<string, string> = {
  'Ethereum': '1',
  'BSC': '56',
  'Polygon': '137',
  'Arbitrum': '42161',
  'Optimism': '10',
  'Avalanche': '43114',
};

/**
 * 快速策略表单组件
 */
export function QuickStrategyForm({
  isOpen,
  onOpenChange,
  onSuccess,
  opportunityData
}: Readonly<QuickStrategyFormProps>) {
  // 使用 useMemo 包装默认值对象，避免在每次渲染时重新创建
  const defaultValues = useMemo<ArbitrageStrategyConfig>(() => ({
    name: opportunityData ? `${opportunityData.symbol} 套利策略` : '',
    symbol: opportunityData?.symbol ?? '',
    chain_id: opportunityData ? CHAIN_ID_MAP[opportunityData.chain] ?? '1' : '1',
    token_address: '',
    buy_exchange: opportunityData?.buyExchange.toLowerCase() ?? '',
    sell_exchange: opportunityData?.sellExchange.toLowerCase() ?? '',
    min_price_diff: opportunityData?.priceDifferencePercentage ?? 3.0,
    direction: ArbitrageDirection.EXCHANGE_TO_CHAIN,
    min_trade_amount: 100,
    max_trade_amount: 500,
    max_position: 2000,
    trade_mode: TradeMode.SPOT,
    hedge_type: HedgeType.NONE,
    hedge_position: null,
    hedge_leverage: null,
    hedge_enabled: false,
    bidirectional: true,
    open_price_diff: opportunityData?.priceDifferencePercentage ?? 3.0,
    close_price_diff: -1.0,
    batch_buying: false,
    batch_count: null,
    batch_interval: null,
    enabled: true,
    futures_enabled: false,
    pool_size: PoolSize.MEDIUM,
    one_to_one_hedge: true,
    close_position_together: true
  }), [opportunityData]);

  const [strategy, setStrategy] = useState<ArbitrageStrategyConfig>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [buyExchangeApiKeys, setBuyExchangeApiKeys] = useState<ApiKey[]>([]);
  const [sellExchangeApiKeys, setSellExchangeApiKeys] = useState<ApiKey[]>([]);
  const [loadingApiKeys, setLoadingApiKeys] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // 当组件打开时，重置表单
  useEffect(() => {
    if (isOpen) {
      setStrategy(defaultValues);
      setError(null);
    }
  }, [isOpen, opportunityData, defaultValues]);
  
  // 加载交易所列表
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await exchangeApi.getExchanges();
        setExchanges(response.data?.items ?? []);
      } catch (error) {
        console.error('获取交易所列表失败:', error);
      }
    };
    
    fetchExchanges();
  }, []);
  
  // 当买入交易所变化时，加载对应的API密钥
  useEffect(() => {
    if (!strategy.buy_exchange) return;
    
    const fetchBuyExchangeApiKeys = async () => {
      setLoadingApiKeys(true);
      try {
        // 找到对应的交易所ID
        const exchange = exchanges.find(e => e.name.toLowerCase() === strategy.buy_exchange.toLowerCase());
        if (exchange) {
          const response = await apiKeyApi.getExchangeApiKeys(exchange.id);
          setBuyExchangeApiKeys(response.data?.items ?? []);
        }
      } catch (error) {
        console.error('获取买入交易所API密钥失败:', error);
      } finally {
        setLoadingApiKeys(false);
      }
    };
    
    fetchBuyExchangeApiKeys();
  }, [strategy.buy_exchange, exchanges]);
  
  // 当卖出交易所变化时，加载对应的API密钥
  useEffect(() => {
    if (!strategy.sell_exchange) return;
    
    const fetchSellExchangeApiKeys = async () => {
      setLoadingApiKeys(true);
      try {
        // 找到对应的交易所ID
        const exchange = exchanges.find(e => e.name.toLowerCase() === strategy.sell_exchange.toLowerCase());
        if (exchange) {
          const response = await apiKeyApi.getExchangeApiKeys(exchange.id);
          setSellExchangeApiKeys(response.data?.items ?? []);
        }
      } catch (error) {
        console.error('获取卖出交易所API密钥失败:', error);
      } finally {
        setLoadingApiKeys(false);
      }
    };
    
    fetchSellExchangeApiKeys();
  }, [strategy.sell_exchange, exchanges]);

  /**
   * 处理策略更新
   */
  const handleStrategyChange = (updatedStrategy: Partial<ArbitrageStrategyConfig>) => {
    setStrategy(prev => ({ ...prev, ...updatedStrategy }));
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await arbitrageApi.createStrategy(strategy);
      
      if (response.data?.data) {
        alert('策略创建成功！');
        onSuccess();
        onOpenChange(false);
      } else {
        setError('创建策略失败，请检查表单并重试');
      }
    } catch (err) {
      console.error('创建策略失败:', err);
      setError('创建策略失败，请检查表单并重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 创建并执行策略
   */
  const handleCreateAndExecute = async () => {
    try {
      setIsExecuting(true);
      setError(null);
      
      // 1. 创建策略
      const createResponse = await arbitrageApi.createStrategy(strategy);
      
      if (!createResponse.data?.data) {
        setError('创建策略失败，请检查表单并重试');
        return;
      }
      
      // 2. 执行策略
      await arbitrageApi.executeStrategy(createResponse.data.data.id);
      
      alert('策略创建并执行成功！');
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('创建或执行策略失败:', err);
      setError('创建或执行策略失败，请检查表单并重试');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>快速创建套利策略</DialogTitle>
          <DialogDescription>
            根据套利机会自动填充策略参数，可以直接创建并执行。
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col" style={{ minHeight: '400px' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="exchange">交易所</TabsTrigger>
              <TabsTrigger value="trade">交易参数</TabsTrigger>
              <TabsTrigger value="advanced">高级设置</TabsTrigger>
            </TabsList>
            
            <div className="flex-grow" style={{ minHeight: '320px' }}>
              <TabsContent value="basic" className="space-y-4 h-full">
                <BasicInfoSection 
                  strategy={strategy} 
                  onStrategyChange={handleStrategyChange} 
                />
              </TabsContent>
              
              <TabsContent value="exchange" className="space-y-4 h-full">
                <ExchangeSection 
                  strategy={strategy} 
                  onStrategyChange={handleStrategyChange}
                  exchanges={exchanges}
                  buyExchangeApiKeys={buyExchangeApiKeys}
                  sellExchangeApiKeys={sellExchangeApiKeys}
                  loadingApiKeys={loadingApiKeys}
                />
              </TabsContent>
              
              <TabsContent value="trade" className="space-y-4 h-full">
                <TradeParamsSection 
                  strategy={strategy} 
                  onStrategyChange={handleStrategyChange} 
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 h-full">
                <AdvancedSettingsSection 
                  strategy={strategy} 
                  onStrategyChange={handleStrategyChange} 
                />
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex justify-between mt-4">
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  const prevTab: Record<string, string> = {
                    'basic': 'basic',
                    'exchange': 'basic',
                    'trade': 'exchange',
                    'advanced': 'trade'
                  };
                  setActiveTab(prevTab[activeTab] || 'basic');
                }}
                disabled={activeTab === 'basic'}
              >
                上一步
              </Button>
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  const nextTab: Record<string, string> = {
                    'basic': 'exchange',
                    'exchange': 'trade',
                    'trade': 'advanced',
                    'advanced': 'advanced'
                  };
                  setActiveTab(nextTab[activeTab] || 'advanced');
                }}
                disabled={activeTab === 'advanced'}
              >
                下一步
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isExecuting}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isExecuting}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : '仅创建'}
          </Button>
          <Button onClick={handleCreateAndExecute} disabled={isLoading || isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                执行中...
              </>
            ) : '创建并执行'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
