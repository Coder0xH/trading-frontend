'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArbitrageStrategyConfig,
  ArbitrageDirection
} from '@/types/arbitrage';
import arbitrageApi from '@/api/arbitrage';
import { apiKeyApi } from '@/api/apiKeys';
import { exchangeApi } from '@/api/exchanges';
import { ApiKey } from '@/types/apiKey';
import { Exchange } from '@/types/exchange';

interface StrategyFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  isEditing: boolean;
  editingStrategyId: string | null;
  initialValues: ArbitrageStrategyConfig;
}

/**
 * 策略表单组件
 */
export function StrategyForm({
  isOpen,
  onOpenChange,
  onSuccess,
  isEditing,
  editingStrategyId,
  initialValues
}: Readonly<StrategyFormProps>) {
  const [strategy, setStrategy] = useState<ArbitrageStrategyConfig & {
    buy_exchange_api_key_id?: number;
    sell_exchange_api_key_id?: number;
  }>({...initialValues, buy_exchange_api_key_id: undefined, sell_exchange_api_key_id: undefined});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [buyExchangeApiKeys, setBuyExchangeApiKeys] = useState<ApiKey[]>([]);
  const [sellExchangeApiKeys, setSellExchangeApiKeys] = useState<ApiKey[]>([]);
  const [loadingApiKeys, setLoadingApiKeys] = useState(false);
  
  // 加载交易所列表
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await exchangeApi.getExchanges();
        setExchanges(response.data?.items || []);
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
          setBuyExchangeApiKeys(response.data?.items || []);
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
          setSellExchangeApiKeys(response.data?.items || []);
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
   * 处理表单提交
   */
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isEditing && editingStrategyId) {
        await arbitrageApi.updateStrategy(editingStrategyId, strategy);
        alert('策略更新成功！');
      } else {
        await arbitrageApi.createStrategy(strategy);
        alert('策略创建成功！');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(isEditing ? '更新策略失败:' : '创建策略失败:', err);
      setError(isEditing ? '更新策略失败，请检查表单并重试' : '创建策略失败，请检查表单并重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取按钮文本
  const getButtonText = () => {
    if (isLoading) {
      return '处理中...';
    }
    return isEditing ? '保存' : '创建';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? '编辑策略' : '新建套利策略'}</DialogTitle>
          <DialogDescription>
            {isEditing ? '修改套利策略参数' : '设置套利策略参数，创建后可以立即执行或自动运行。'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">策略名称</Label>
              <Input 
                id="name" 
                value={strategy.name} 
                onChange={(e) => setStrategy({...strategy, name: e.target.value})}
                placeholder="输入策略名称" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">交易对</Label>
              <Input 
                id="symbol" 
                value={strategy.symbol} 
                onChange={(e) => setStrategy({...strategy, symbol: e.target.value})}
                placeholder="例如: BTC/USDT" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buy_exchange">买入交易所</Label>
              <Input 
                id="buy_exchange" 
                value={strategy.buy_exchange} 
                onChange={(e) => setStrategy({...strategy, buy_exchange: e.target.value, buy_exchange_api_key_id: undefined})}
                placeholder="例如: binance" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sell_exchange">卖出交易所</Label>
              <Input 
                id="sell_exchange" 
                value={strategy.sell_exchange} 
                onChange={(e) => setStrategy({...strategy, sell_exchange: e.target.value, sell_exchange_api_key_id: undefined})}
                placeholder="例如: bybit" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buy_exchange_api_key_id">买入交易所API密钥</Label>
              <Select
                value={strategy.buy_exchange_api_key_id ? String(strategy.buy_exchange_api_key_id) : undefined}
                onValueChange={(value) => setStrategy({...strategy, buy_exchange_api_key_id: value ? Number(value) : undefined})}
                disabled={loadingApiKeys || buyExchangeApiKeys.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择API密钥" />
                </SelectTrigger>
                <SelectContent>
                  {buyExchangeApiKeys.map((apiKey) => (
                    <SelectItem key={apiKey.id} value={apiKey.id}>
                      {apiKey.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {buyExchangeApiKeys.length === 0 && strategy.buy_exchange && (
                <p className="text-xs text-red-500 mt-1">没有找到{strategy.buy_exchange}的API密钥，请先添加</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sell_exchange_api_key_id">卖出交易所API密钥</Label>
              <Select
                value={strategy.sell_exchange_api_key_id ? String(strategy.sell_exchange_api_key_id) : undefined}
                onValueChange={(value) => setStrategy({...strategy, sell_exchange_api_key_id: value ? Number(value) : undefined})}
                disabled={loadingApiKeys || sellExchangeApiKeys.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择API密钥" />
                </SelectTrigger>
                <SelectContent>
                  {sellExchangeApiKeys.map((apiKey) => (
                    <SelectItem key={apiKey.id} value={apiKey.id}>
                      {apiKey.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sellExchangeApiKeys.length === 0 && strategy.sell_exchange && (
                <p className="text-xs text-red-500 mt-1">没有找到{strategy.sell_exchange}的API密钥，请先添加</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chain_id">链ID</Label>
              <Input 
                id="chain_id" 
                value={strategy.chain_id} 
                onChange={(e) => setStrategy({...strategy, chain_id: e.target.value})}
                placeholder="例如: 56 (BSC)" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direction">方向</Label>
              <select 
                id="direction"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={strategy.direction}
                onChange={(e) => setStrategy({...strategy, direction: e.target.value as ArbitrageDirection})}
              >
                <option value={ArbitrageDirection.CHAIN_TO_EXCHANGE}>链上→交易所</option>
                <option value={ArbitrageDirection.EXCHANGE_TO_CHAIN}>交易所→链上</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_trade_amount">最小交易金额</Label>
              <Input 
                id="min_trade_amount" 
                type="number"
                value={strategy.min_trade_amount} 
                onChange={(e) => setStrategy({...strategy, min_trade_amount: Number(e.target.value)})}
                placeholder="最小交易金额" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_trade_amount">最大交易金额</Label>
              <Input 
                id="max_trade_amount" 
                type="number"
                value={strategy.max_trade_amount} 
                onChange={(e) => setStrategy({...strategy, max_trade_amount: Number(e.target.value)})}
                placeholder="最大交易金额" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_position">最大持仓金额</Label>
              <Input 
                id="max_position" 
                type="number"
                value={strategy.max_position} 
                onChange={(e) => setStrategy({...strategy, max_position: Number(e.target.value)})}
                placeholder="最大持仓金额" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="open_price_diff">开仓价差(%)</Label>
              <Input 
                id="open_price_diff" 
                type="number"
                value={strategy.open_price_diff} 
                onChange={(e) => setStrategy({...strategy, open_price_diff: Number(e.target.value)})}
                placeholder="开仓价差百分比" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_price_diff">最小价差(%)</Label>
              <Input 
                id="min_price_diff" 
                type="number"
                value={strategy.min_price_diff} 
                onChange={(e) => setStrategy({...strategy, min_price_diff: Number(e.target.value)})}
                placeholder="最小价差百分比" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enabled">状态</Label>
              <select 
                id="enabled"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={strategy.enabled ? "true" : "false"}
                onChange={(e) => setStrategy({...strategy, enabled: e.target.value === "true"})}
              >
                <option value="true">启用</option>
                <option value="false">禁用</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bidirectional">双向添加</Label>
              <select 
                id="bidirectional"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={strategy.bidirectional ? "true" : "false"}
                onChange={(e) => setStrategy({...strategy, bidirectional: e.target.value === "true"})}
              >
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
