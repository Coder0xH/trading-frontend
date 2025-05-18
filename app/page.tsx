'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
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
import {
  AlertTriangleIcon,
  TrendingUpIcon,
  Loader2
} from 'lucide-react';

import arbitrageApi from '@/api/arbitrage';
import { ArbitrageStrategy } from '@/types/arbitrage';
import { QuickStrategyForm } from '@/components/strategies/QuickStrategyForm';

/**
 * 模拟套利机会数据
 */
const mockArbitrageData = [
  {
    id: '1',
    symbol: 'ETH/USDT',
    buyExchange: 'OKX-DEX',
    sellExchange: 'BINANCE',
    buyPrice: 3450.25,
    sellPrice: 3520.75,
    priceDifference: 70.5,
    priceDifferencePercentage: 2.04,
    volume24h: 2500000,
    poolSize: 8500000,
    chain: 'Ethereum',
    withdrawEnabled: true,
    depositEnabled: true,
    aggregator: 'OKX',
    timestamp: new Date().getTime() - 120000,
  }
];

/**
 * 获取机会状态文本
 */
function getOpportunityStatus(opportunity: typeof mockArbitrageData[0]) {
  if (!opportunity.withdrawEnabled && !opportunity.depositEnabled) {
    return '冲提受限';
  } else if (!opportunity.withdrawEnabled) {
    return '提现受限';
  } else if (!opportunity.depositEnabled) {
    return '充值受限';
  } else {
    return '正常';
  }
}

/**
 * 首页组件
 */
export default function Home() {
  // 状态管理
  const [opportunities] = useState(mockArbitrageData);
  const [strategies, setStrategies] = useState<ArbitrageStrategy[]>([]);
  const [executingStrategy, setExecutingStrategy] = useState<string | null>(null);
  const [isQuickFormOpen, setIsQuickFormOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof mockArbitrageData[0] | null>(null);

  /**
   * 加载套利策略
   */
  const fetchStrategies = async () => {
    try {
      // 移除了加载状态的设置，因为当前没有在UI中显示加载状态
      const response = await arbitrageApi.getStrategies();
      setStrategies(response.data?.items || []);
    } catch (error) {
      console.error('获取策略列表失败:', error);
    }
  };
  
  // 组件加载时获取策略列表
  useEffect(() => {
    fetchStrategies();
  }, []);

  /**
   * 处理套利按钮点击
   */
  const handleArbitrage = async (opportunity: typeof mockArbitrageData[0]) => {
    // 找到匹配的策略（这里简单地根据交易对匹配）
    const matchedStrategy = strategies.find(strategy =>
      strategy.symbol === opportunity.symbol
    );

    if (matchedStrategy) {
      try {
        setExecutingStrategy(opportunity.id);
        await arbitrageApi.executeStrategy(matchedStrategy.id);
        alert(`已成功执行套利策略: ${matchedStrategy.name}`);
      } catch (error) {
        console.error('执行套利策略失败:', error);
        alert('执行套利策略失败，请稍后重试');
      } finally {
        setExecutingStrategy(null);
      }
    } else {
      // 如果没有匹配的策略，打开快速创建表单
      setSelectedOpportunity(opportunity);
      setIsQuickFormOpen(true);
    }
  };
  
  /**
   * 策略创建成功后的回调
   */
  const handleStrategySuccess = async () => {
    // 重新加载策略列表
    await fetchStrategies();
  };

  return (
    <div className="container py-6 space-y-6">
      {/* 快速创建策略表单 */}
      <QuickStrategyForm 
        isOpen={isQuickFormOpen}
        onOpenChange={setIsQuickFormOpen}
        onSuccess={handleStrategySuccess}
        opportunityData={selectedOpportunity}
      />
      
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">套利机会</h1>
          <p className="text-muted-foreground">
            发现并利用不同交易所之间的价格差异获利
          </p>
        </div>

        {/* 套利机会列表 - 表格视图 */}
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
                            {getOpportunityStatus(opportunity)}
                          </span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                          正常
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArbitrage(opportunity)}
                        disabled={executingStrategy === opportunity.id}
                      >
                        {executingStrategy === opportunity.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            执行中
                          </>
                        ) : (
                          <>
                            <TrendingUpIcon className="mr-2 h-4 w-4" />
                            套利
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
