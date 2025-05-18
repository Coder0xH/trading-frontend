'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { ArbitrageDirection, TradeMode, HedgeType, ArbitrageStrategyConfig } from '@/types/arbitrage';

interface EmptyStateProps {
  readonly onCreateNew: () => void;
}

/**
 * 空状态组件 - 当没有策略时显示
 */
export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-muted-foreground mb-4">暂无策略</p>
      <Button onClick={onCreateNew} variant="outline">
        <PlusIcon className="h-4 w-4 mr-2" />
        添加第一个策略
      </Button>
    </div>
  );
}

/**
 * 获取默认的策略配置
 */
export function getDefaultStrategyConfig(): ArbitrageStrategyConfig {
  return {
    name: '',
    symbol: 'BTC/USDT',
    chain_id: '56',
    buy_exchange: 'binance',
    sell_exchange: 'bybit',
    direction: ArbitrageDirection.CHAIN_TO_EXCHANGE,
    min_trade_amount: 100,
    max_trade_amount: 1000,
    max_position: 5000,
    open_price_diff: 3,
    min_price_diff: 3,
    enabled: true,
    trade_mode: TradeMode.SPOT,
    hedge_type: HedgeType.NONE,
    bidirectional: false
  };
}
