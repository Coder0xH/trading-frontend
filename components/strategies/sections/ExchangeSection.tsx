'use client';

import { useState, useEffect, useCallback } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArbitrageStrategyConfig } from '@/types/arbitrage';
import { Exchange } from '@/types/exchange';
import { ApiKey } from '@/types/apiKey';
import exchangeApi from '@/api/exchanges';

interface ExchangeSectionProps {
  strategy: ArbitrageStrategyConfig;
  onStrategyChange: (updatedStrategy: Partial<ArbitrageStrategyConfig>) => void;
  exchanges?: Exchange[];
  buyExchangeApiKeys?: ApiKey[];
  sellExchangeApiKeys?: ApiKey[];
  loadingApiKeys?: boolean;
}

/**
 * 交易所设置组件
 * 用于选择买入和卖出交易所及其API密钥
 */
export function ExchangeSection({
  strategy,
  onStrategyChange,
  exchanges: propExchanges,
  buyExchangeApiKeys: propBuyExchangeApiKeys,
  sellExchangeApiKeys: propSellExchangeApiKeys,
  loadingApiKeys: propLoadingApiKeys
}: Readonly<ExchangeSectionProps>) {
  // 状态管理
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>(propExchanges || []);
  const [buyExchangeApiKeys, setBuyExchangeApiKeys] = useState<ApiKey[]>(propBuyExchangeApiKeys || []);
  const [sellExchangeApiKeys, setSellExchangeApiKeys] = useState<ApiKey[]>(propSellExchangeApiKeys || []);
  const [isLoadingExchanges, setIsLoadingExchanges] = useState(false);
  const [loadingApiKeys, setLoadingApiKeys] = useState(propLoadingApiKeys || false);
  
  /**
   * 解析API响应中的数据数组
   * @param responseData API响应数据
   * @returns 解析后的数组
   */
  const parseApiResponseArray = <T,>(responseData: unknown): T[] => {
    console.log('解析数组输入数据:', responseData);
    
    // 如果直接是数组，直接返回
    if (Array.isArray(responseData)) {
      console.log('输入是数组，直接返回');
      return responseData;
    }
    
    console.log('无法解析数据，返回空数组');
    return [];
  };
  
  /**
   * 更新API密钥状态
   * @param apiKeys API密钥列表
   * @param isBuyExchange 是否为买入交易所
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateApiKeyState = useCallback((apiKeys: ApiKey[], isBuyExchange: boolean) => {
    console.log(`更新${isBuyExchange ? '买入' : '卖出'}交易所API密钥:`, apiKeys);
    console.log('密钥数据结构:', JSON.stringify(apiKeys[0] || {}, null, 2));
    
    if (isBuyExchange) {
      setBuyExchangeApiKeys(apiKeys);
      // 不要在这里读取状态，因为状态更新是异步的
      console.log('设置买入交易所API密钥');
    } else {
      setSellExchangeApiKeys(apiKeys);
      console.log('设置卖出交易所API密钥');
    }
    
    // 如果当前错误与 API 密钥相关，清除错误
    if (error?.includes('API密钥')) {
      setError(null);
    }
  }, []); // 有意忽略error依赖，因为它会导致循环依赖问题
  
  /**
   * 获取交易所的API密钥列表
   * @param exchangeId 交易所ID
   * @param isBuyExchange 是否为买入交易所
   */
  const fetchExchangeApiKeys = useCallback(async (exchangeId: number, isBuyExchange: boolean) => {
    try {
      setLoadingApiKeys(true);
      setError(null);
      
      const exchangeType = isBuyExchange ? '买入' : '卖出';
      const response = await exchangeApi.getExchangeApiKeys(exchangeId.toString());
      
      console.log(`${exchangeType}交易所API密钥响应:`, response);
      
      // 解析
      const apiKeys = parseApiResponseArray<ApiKey>(response.data.items);
      console.log("解析后的数据-->", apiKeys);
      
      // 更新 api key 状态
      updateApiKeyState(apiKeys, isBuyExchange);
    } catch (err) {
      const exchangeType = isBuyExchange ? '买入' : '卖出';
      console.error(`获取${exchangeType}交易所API密钥失败:`, err);
      // 只在当前没有其他错误时设置错误
      if (!error) {
        setError(`获取${exchangeType}交易所API密钥失败，请重试`);
      }
    } finally {
      setLoadingApiKeys(false);
    }
  }, [updateApiKeyState]); // 移除error依赖，因为这会导致循环调用
  
  /**
   * 获取交易所列表
   */
  const fetchExchanges = async () => {
    try {
      setIsLoadingExchanges(true);
      setError(null);
      
      console.log('开始获取交易所列表...');
      const response = await exchangeApi.getExchanges();
      
      console.log('交易所原始响应数据:', response.data.items);
      
      // 关键修复: 如果响应本身就是数组，直接使用响应作为交易所列表
      if (Array.isArray(response.data.items)) {
        console.log('响应是数组，直接使用');
        setExchanges(response.data.items);
        console.log('交易所数量:', response.data.items.length);
      }
      
      setError(null); // 清除错误信息
    } catch (err) {
      console.error('获取交易所列表失败:', err);
      setError('获取交易所列表失败，请重试');
    } finally {
      setIsLoadingExchanges(false);
    }
  };
  
  /**
   * 刷新指定交易所的API密钥列表
   * @param exchangeId 交易所ID
   * @param isBuyExchange 是否为买入交易所
   */
  const refreshApiKeys = async (exchangeId: number, isBuyExchange: boolean) => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      await fetchExchangeApiKeys(exchangeId, isBuyExchange);
    } catch (err) {
      console.error('刷新API密钥列表失败:', err);
      setError('刷新API密钥列表失败，请重试');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // 当传入的交易所列表变化时更新状态
  useEffect(() => {
    if (propExchanges && propExchanges.length > 0) {
      setExchanges(propExchanges);
    } else {
      fetchExchanges();
    }
  }, [propExchanges]);
  
  // 当传入的API密钥列表变化时更新状态
  useEffect(() => {
    if (propBuyExchangeApiKeys) {
      setBuyExchangeApiKeys(propBuyExchangeApiKeys);
    }
  }, [propBuyExchangeApiKeys]);
  
  useEffect(() => {
    if (propSellExchangeApiKeys) {
      setSellExchangeApiKeys(propSellExchangeApiKeys);
    }
  }, [propSellExchangeApiKeys]);
  
  // 当加载状态变化时更新
  useEffect(() => {
    if (propLoadingApiKeys !== undefined) {
      setLoadingApiKeys(propLoadingApiKeys);
    }
  }, [propLoadingApiKeys]);
  
  // 当选择买入交易所变化时，获取对应的API密钥
  useEffect(() => {
    if (strategy.buy_exchange && exchanges.length > 0) {
      // 不区分大小写匹配交易所名称
      const buyExchange = exchanges.find(e => 
        e.name?.toLowerCase() === strategy.buy_exchange?.toLowerCase()
      );
      if (buyExchange) {
        fetchExchangeApiKeys(Number(buyExchange.id), true);
      }
    }
  }, [strategy.buy_exchange, exchanges, fetchExchangeApiKeys]);
  
  // 当选择卖出交易所变化时，获取对应的API密钥
  useEffect(() => {
    if (strategy.sell_exchange && exchanges.length > 0) {
      // 不区分大小写匹配交易所名称
      const sellExchange = exchanges.find(e => 
        e.name?.toLowerCase() === strategy.sell_exchange?.toLowerCase()
      );
      if (sellExchange) {
        fetchExchangeApiKeys(Number(sellExchange.id), false);
      }
    }
  }, [strategy.sell_exchange, exchanges, fetchExchangeApiKeys]);
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buy_exchange">买入交易所</Label>
          <Select
            value={strategy.buy_exchange}
            onValueChange={(value) => onStrategyChange({
              buy_exchange: value,
              buy_exchange_api_key_id: undefined // 重置API密钥
            })}
            disabled={isLoadingExchanges}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingExchanges ? "加载交易所列表中..." : "选择买入交易所"} />
            </SelectTrigger>
            <SelectContent>
              {exchanges.map((exchange) => (
                <SelectItem key={exchange.id} value={exchange.name.toLowerCase()}>
                  {exchange.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sell_exchange">卖出交易所</Label>
          <Select
            value={strategy.sell_exchange}
            onValueChange={(value) => onStrategyChange({
              sell_exchange: value,
              sell_exchange_api_key_id: undefined // 重置API密钥
            })}
            disabled={isLoadingExchanges}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingExchanges ? "加载交易所列表中..." : "选择卖出交易所"} />
            </SelectTrigger>
            <SelectContent>
              {exchanges.map((exchange) => (
                <SelectItem key={exchange.id} value={exchange.name.toLowerCase()}>
                  {exchange.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="buy_exchange_api_key_id">买入交易所API密钥</Label>
            {strategy.buy_exchange && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const buyExchange = exchanges.find(e => 
                      e.name?.toLowerCase() === strategy.buy_exchange?.toLowerCase()
                    );
                    if (buyExchange) {
                      refreshApiKeys(Number(buyExchange.id), true);
                    }
                  }}
                  disabled={isRefreshing || !strategy.buy_exchange}
                >
                  <RefreshCwIcon className="h-3 w-3 mr-1" />
                  刷新
                </Button>
              </div>
            )}
          </div>
          <Select
            value={strategy.buy_exchange_api_key_id ? String(strategy.buy_exchange_api_key_id) : undefined}
            onValueChange={(value) => onStrategyChange({ buy_exchange_api_key_id: value ? Number(value) : undefined })}
            disabled={loadingApiKeys || buyExchangeApiKeys.length === 0 || isRefreshing}
          >
            <SelectTrigger>
              <SelectValue placeholder={isRefreshing ? "加载中..." : "选择API密钥"} />
            </SelectTrigger>
            <SelectContent>
              {buyExchangeApiKeys.map((apiKey) => (
                <SelectItem key={apiKey.id} value={String(apiKey.id)}>
                  {/* 优先使用label或name作为显示名称 */}
                  {apiKey.label ?? apiKey.name ?? `API密钥 ${apiKey.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {buyExchangeApiKeys.length === 0 && strategy.buy_exchange && !isRefreshing && (
            <p className="text-xs text-red-500 mt-1">没有找到{strategy.buy_exchange}的API密钥，请添加</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="sell_exchange_api_key_id">卖出交易所API密钥</Label>
            {strategy.sell_exchange && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const sellExchange = exchanges.find(e => 
                      e.name?.toLowerCase() === strategy.sell_exchange?.toLowerCase()
                    );
                    if (sellExchange) {
                      refreshApiKeys(Number(sellExchange.id), false);
                    }
                  }}
                  disabled={isRefreshing || !strategy.sell_exchange}
                >
                  <RefreshCwIcon className="h-3 w-3 mr-1" />
                  刷新
                </Button>
              </div>
            )}
          </div>
          <Select
            value={strategy.sell_exchange_api_key_id ? String(strategy.sell_exchange_api_key_id) : undefined}
            onValueChange={(value) => onStrategyChange({ sell_exchange_api_key_id: value ? Number(value) : undefined })}
            disabled={loadingApiKeys || sellExchangeApiKeys.length === 0 || isRefreshing}
          >
            <SelectTrigger>
              <SelectValue placeholder={isRefreshing ? "加载中..." : "选择API密钥"} />
            </SelectTrigger>
            <SelectContent>
              {sellExchangeApiKeys.map((apiKey) => (
                <SelectItem key={apiKey.id} value={String(apiKey.id)}>
                  {/* 优先使用label或name作为显示名称 */}
                  {apiKey.label ?? apiKey.name ?? `API密钥 ${apiKey.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {sellExchangeApiKeys.length === 0 && strategy.sell_exchange && !isRefreshing && (
            <p className="text-xs text-red-500 mt-1">没有找到{strategy.sell_exchange}的API密钥，请添加</p>
          )}
        </div>
      </div>
    </div>
  );
}
