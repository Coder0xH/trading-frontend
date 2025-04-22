'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { 
  RefreshCwIcon, 
  AlertTriangleIcon,
  TrendingUpIcon
} from 'lucide-react';
import { ArbitrageFilters } from "@/components/arbitrage/ArbitrageFilters";
import { ArbitrageOpportunityCard } from "@/components/arbitrage/ArbitrageOpportunityCard";

/**
 * 模拟套利机会数据
 */
const mockArbitrageData = [
  {
    id: '1',
    symbol: 'ETH/USDT',
    buyExchange: 'Binance',
    sellExchange: 'OKX',
    buyPrice: 3450.25,
    sellPrice: 3520.75,
    priceDifference: 70.5,
    priceDifferencePercentage: 2.04,
    volume24h: 1250000,
    poolSize: 8500000,
    chain: 'Ethereum',
    withdrawEnabled: true,
    depositEnabled: true,
    aggregator: 'ODOS',
    timestamp: new Date().getTime() - 120000,
  },
  {
    id: '2',
    symbol: 'BTC/USDT',
    buyExchange: 'Bitget',
    sellExchange: 'Binance',
    buyPrice: 63250.50,
    sellPrice: 63750.25,
    priceDifference: 499.75,
    priceDifferencePercentage: 0.79,
    volume24h: 3500000,
    poolSize: 25000000,
    chain: 'Bitcoin',
    withdrawEnabled: true,
    depositEnabled: true,
    aggregator: 'ODOS',
    timestamp: new Date().getTime() - 180000,
  },
  {
    id: '3',
    symbol: 'SOL/USDT',
    buyExchange: 'OKX',
    sellExchange: 'Binance',
    buyPrice: 142.25,
    sellPrice: 145.50,
    priceDifference: 3.25,
    priceDifferencePercentage: 2.28,
    volume24h: 850000,
    poolSize: 3200000,
    chain: 'Solana',
    withdrawEnabled: false,
    depositEnabled: true,
    aggregator: '待定',
    timestamp: new Date().getTime() - 60000,
  },
  {
    id: '4',
    symbol: 'AVAX/USDT',
    buyExchange: 'Binance',
    sellExchange: 'Bitget',
    buyPrice: 28.75,
    sellPrice: 29.45,
    priceDifference: 0.70,
    priceDifferencePercentage: 2.43,
    volume24h: 420000,
    poolSize: 1800000,
    chain: 'Avalanche',
    withdrawEnabled: true,
    depositEnabled: true,
    aggregator: 'ODOS',
    timestamp: new Date().getTime() - 240000,
  },
  {
    id: '5',
    symbol: 'LINK/USDT',
    buyExchange: 'Bitget',
    sellExchange: 'OKX',
    buyPrice: 15.25,
    sellPrice: 15.55,
    priceDifference: 0.30,
    priceDifferencePercentage: 1.97,
    volume24h: 320000,
    poolSize: 950000,
    chain: 'Ethereum',
    withdrawEnabled: true,
    depositEnabled: false,
    aggregator: 'ODOS',
    timestamp: new Date().getTime() - 300000,
  },
];

/**
 * 套利机会组件
 * 显示所有可用的套利机会，支持卡片和表格视图
 */
export function ArbitrageOpportunities() {
  // 使用 useState 但不解构 setter，因为目前未使用
  const [opportunities] = useState(mockArbitrageData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [view, setView] = useState<'card' | 'table'>('card');
  
  /**
   * 模拟刷新套利机会数据
   */
  const refreshOpportunities = () => {
    setIsRefreshing(true);
    // 模拟API请求延迟
    setTimeout(() => {
      // 在实际应用中，这里会调用API获取最新数据
      setIsRefreshing(false);
    }, 1000);
  };

  /**
   * 格式化时间戳为相对时间
   * @param timestamp - 时间戳（毫秒）
   * @returns 格式化后的相对时间字符串
   */
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}秒前`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 过滤器和控制区域 */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>筛选条件</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshOpportunities}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                    刷新中
                  </>
                ) : (
                  <>
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    刷新数据
                  </>
                )}
              </Button>
            </div>
            <CardDescription>
              设置筛选条件以找到最佳套利机会
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArbitrageFilters />
          </CardContent>
        </Card>
      </div>

      {/* 视图切换 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          显示 <strong>{opportunities.length}</strong> 个套利机会
        </div>
        <Tabs defaultValue="card" className="w-[200px]" onValueChange={(v) => setView(v as 'card' | 'table')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">卡片视图</TabsTrigger>
            <TabsTrigger value="table">表格视图</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 套利机会列表 */}
      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity) => (
            <ArbitrageOpportunityCard 
              key={opportunity.id} 
              opportunity={opportunity} 
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">交易对</TableHead>
                  <TableHead>买入/卖出</TableHead>
                  <TableHead className="text-right">价格差异</TableHead>
                  <TableHead className="text-right">24h成交量</TableHead>
                  <TableHead className="text-right">池子大小</TableHead>
                  <TableHead>链</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.symbol}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-muted-foreground">买: {opportunity.buyExchange}</div>
                        <div className="text-xs text-muted-foreground">卖: {opportunity.sellExchange}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {opportunity.priceDifferencePercentage.toFixed(2)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ${opportunity.priceDifference.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${(opportunity.volume24h / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="text-right">${(opportunity.poolSize / 1000000).toFixed(2)}M</TableCell>
                    <TableCell>{opportunity.chain}</TableCell>
                    <TableCell>
                      {(!opportunity.withdrawEnabled || !opportunity.depositEnabled) ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangleIcon className="h-3 w-3" />
                          <span>
                            {!opportunity.withdrawEnabled && !opportunity.depositEnabled 
                              ? '冲提受限' 
                              : !opportunity.withdrawEnabled 
                                ? '提现受限' 
                                : '充值受限'}
                          </span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                          正常
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        <TrendingUpIcon className="mr-2 h-4 w-4" />
                        套利
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
