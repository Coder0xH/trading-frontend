'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArbitrageStrategyConfig,
  ArbitrageDirection,
  TradeMode,
  PoolSize
} from '@/types/arbitrage';

interface TradeParamsSectionProps {
  strategy: ArbitrageStrategyConfig;
  onStrategyChange: (updatedStrategy: Partial<ArbitrageStrategyConfig>) => void;
}

/**
 * 交易参数组件
 */
export function TradeParamsSection({ 
  strategy, 
  onStrategyChange 
}: Readonly<TradeParamsSectionProps>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_trade_amount">最小交易金额</Label>
          <Input 
            id="min_trade_amount" 
            type="number"
            value={strategy.min_trade_amount} 
            onChange={(e) => onStrategyChange({ min_trade_amount: parseFloat(e.target.value) })}
            placeholder="例如: 100" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_trade_amount">最大交易金额</Label>
          <Input 
            id="max_trade_amount" 
            type="number"
            value={strategy.max_trade_amount} 
            onChange={(e) => onStrategyChange({ max_trade_amount: parseFloat(e.target.value) })}
            placeholder="例如: 500" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_position">最大持仓金额</Label>
          <Input 
            id="max_position" 
            type="number"
            value={strategy.max_position} 
            onChange={(e) => onStrategyChange({ max_position: parseFloat(e.target.value) })}
            placeholder="例如: 2000" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_price_diff">最小价差百分比</Label>
          <Input 
            id="min_price_diff" 
            type="number"
            value={strategy.min_price_diff} 
            onChange={(e) => onStrategyChange({ min_price_diff: parseFloat(e.target.value) })}
            placeholder="例如: 3.0" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="open_price_diff">开仓价差</Label>
          <Input 
            id="open_price_diff" 
            type="number"
            value={strategy.open_price_diff} 
            onChange={(e) => onStrategyChange({ open_price_diff: parseFloat(e.target.value) })}
            placeholder="例如: 3.0" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="close_price_diff">平仓价差</Label>
          <Input 
            id="close_price_diff" 
            type="number"
            value={strategy.close_price_diff ?? 0} 
            onChange={(e) => onStrategyChange({ close_price_diff: parseFloat(e.target.value) })}
            placeholder="例如: -1.0" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="direction">套利方向</Label>
          <Select
            value={strategy.direction}
            onValueChange={(value: ArbitrageDirection) => onStrategyChange({ direction: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择套利方向" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ArbitrageDirection.CHAIN_TO_EXCHANGE}>链到交易所</SelectItem>
              <SelectItem value={ArbitrageDirection.EXCHANGE_TO_CHAIN}>交易所到链</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="trade_mode">交易模式</Label>
          <Select
            value={strategy.trade_mode}
            onValueChange={(value: TradeMode) => onStrategyChange({ trade_mode: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择交易模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TradeMode.SPOT}>现货</SelectItem>
              <SelectItem value={TradeMode.FUTURES}>合约</SelectItem>
              <SelectItem value={TradeMode.BOTH}>两者</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pool_size">池子大小</Label>
          <Select
            value={strategy.pool_size}
            onValueChange={(value: PoolSize) => onStrategyChange({ pool_size: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择池子大小" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PoolSize.SMALL}>小</SelectItem>
              <SelectItem value={PoolSize.MEDIUM}>中</SelectItem>
              <SelectItem value={PoolSize.LARGE}>大</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
