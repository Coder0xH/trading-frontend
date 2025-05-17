'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUpIcon,
  AlertTriangleIcon
} from 'lucide-react';

/**
 * 套利机会卡片组件属性接口
 */
interface ArbitrageOpportunityCardProps {
  readonly opportunity: {
    id: string;
    symbol: string;
    buyExchange: string;
    sellExchange: string;
    buyPrice: number;
    sellPrice: number;
    priceDifference: number;
    priceDifferencePercentage: number;
    volume24h: number;
    poolSize: number;
    chain: string;
    withdrawEnabled: boolean;
    depositEnabled: boolean;
    aggregator: string;
    timestamp: number;
  };
  readonly formatTimeAgo: (timestamp: number) => string;
}

/**
 * 套利机会卡片组件
 * 显示单个套利机会的详细信息
 */
export function ArbitrageOpportunityCard({ 
  opportunity, 
  formatTimeAgo 
}: ArbitrageOpportunityCardProps) {
  const { 
    symbol, 
    buyExchange, 
    sellExchange, 
    buyPrice, 
    sellPrice, 
    priceDifference, 
    priceDifferencePercentage,
    volume24h,
    poolSize,
    chain,
    withdrawEnabled,
    depositEnabled,
    aggregator,
    timestamp
  } = opportunity;

  /**
   * 格式化数字为货币格式
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  /**
   * 格式化大数字（K, M, B）
   */
  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // 判断是否有充提限制
  const hasWithdrawDepositRestriction = !withdrawEnabled || !depositEnabled;
  
  // 获取充提限制文本
  const getRestrictionText = () => {
    if (!withdrawEnabled && !depositEnabled) {
      return '充值和提现均受限';
    } else if (!withdrawEnabled) {
      return '提现受限';
    } else {
      return '充值受限';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col ${hasWithdrawDepositRestriction ? 'border-red-300 dark:border-red-800' : ''}`}>
      {/* 状态指示区域 - 始终保留空间，无论是否显示警告 */}
      <div className={`h-7 flex items-center justify-center text-xs font-medium ${hasWithdrawDepositRestriction ? 'bg-red-500 text-white' : 'bg-transparent'}`}>
        {hasWithdrawDepositRestriction && (
          <>
            <AlertTriangleIcon className="h-3 w-3 mr-1" />
            {getRestrictionText()}
          </>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{symbol}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {chain} · {aggregator}
            </div>
          </div>
          <Badge className="bg-green-500/90 hover:bg-green-500/80">
            {priceDifferencePercentage.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 border-r pr-4">
            <div className="text-xs text-muted-foreground">买入</div>
            <div className="font-medium">{buyExchange}</div>
            <div className="text-sm">{formatCurrency(buyPrice)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">卖出</div>
            <div className="font-medium">{sellExchange}</div>
            <div className="text-sm">{formatCurrency(sellPrice)}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">价差</span>
            <span className="font-medium">{formatCurrency(priceDifference)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">池子大小</span>
            <span className="font-medium">${formatLargeNumber(poolSize)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">24h成交量</span>
            <span className="font-medium">${formatLargeNumber(volume24h)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">更新时间</span>
            <span className="font-medium">{formatTimeAgo(timestamp)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 mt-auto">
        <Button 
          className="w-full" 
          size="sm"
          disabled={hasWithdrawDepositRestriction}
          variant={hasWithdrawDepositRestriction ? "secondary" : "default"}
        >
          <TrendingUpIcon className="mr-2 h-4 w-4" />
          开始套利
          {hasWithdrawDepositRestriction && <span className="sr-only">（受限）</span>}
        </Button>
      </CardFooter>
    </Card>
  );
}
