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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlayIcon, 
  PauseIcon, 
  PlusIcon, 
  SettingsIcon,
  BarChart3Icon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';

/**
 * 模拟套利策略数据
 */
const mockStrategies = [
  {
    id: '1',
    name: 'ETH-USDT 跨所套利',
    description: '在 Binance 和 OKX 之间套利 ETH/USDT 交易对',
    status: 'active',
    pairs: ['ETH/USDT'],
    exchanges: ['Binance', 'OKX'],
    minProfitPercent: 0.8,
    maxTradeAmount: 5000,
    totalProfit: 1245.75,
    tradesCount: 28,
    successRate: 92.8,
    lastExecuted: new Date().getTime() - 1800000,
    createdAt: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: '2',
    name: 'BTC 三角套利',
    description: 'BTC/USDT -> BTC/ETH -> ETH/USDT 三角套利',
    status: 'paused',
    pairs: ['BTC/USDT', 'BTC/ETH', 'ETH/USDT'],
    exchanges: ['Binance'],
    minProfitPercent: 0.5,
    maxTradeAmount: 10000,
    totalProfit: 3450.25,
    tradesCount: 42,
    successRate: 88.1,
    lastExecuted: new Date().getTime() - 12 * 60 * 60 * 1000,
    createdAt: new Date().getTime() - 14 * 24 * 60 * 60 * 1000,
  },
  {
    id: '3',
    name: 'SOL 闪电套利',
    description: 'Solana 链上 DEX 间的快速套利',
    status: 'error',
    pairs: ['SOL/USDC'],
    exchanges: ['Jupiter', 'Raydium'],
    minProfitPercent: 1.2,
    maxTradeAmount: 2000,
    totalProfit: 580.50,
    tradesCount: 15,
    successRate: 86.7,
    lastExecuted: new Date().getTime() - 5 * 60 * 60 * 1000,
    createdAt: new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: '4',
    name: '稳定币套利',
    description: 'USDT/USDC/DAI 之间的稳定币套利',
    status: 'active',
    pairs: ['USDT/USDC', 'USDC/DAI', 'DAI/USDT'],
    exchanges: ['Binance', 'OKX'],
    minProfitPercent: 0.1,
    maxTradeAmount: 50000,
    totalProfit: 875.25,
    tradesCount: 65,
    successRate: 98.5,
    lastExecuted: new Date().getTime() - 45 * 60 * 1000,
    createdAt: new Date().getTime() - 21 * 24 * 60 * 60 * 1000,
  },
];

/**
 * 套利策略组件
 */
export function ArbitrageStrategies() {
  const [strategies, setStrategies] = useState(mockStrategies);
  const [statusFilter, setStatusFilter] = useState('all');
  
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

  /**
   * 根据策略状态获取状态徽章
   * @param status - 策略状态
   * @returns 状态徽章JSX元素
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            运行中
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
            <PauseIcon className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            错误
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            未知
          </Badge>
        );
    }
  };

  /**
   * 过滤策略列表
   * @returns 过滤后的策略列表
   */
  const getFilteredStrategies = () => {
    if (statusFilter === 'all') return strategies;
    return strategies.filter(strategy => strategy.status === statusFilter);
  };

  /**
   * 切换策略状态
   * @param id - 策略ID
   */
  const toggleStrategyStatus = (id: string) => {
    setStrategies(strategies.map(strategy => {
      if (strategy.id === id) {
        const newStatus = strategy.status === 'active' ? 'paused' : 'active';
        return { ...strategy, status: newStatus };
      }
      return strategy;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="active">运行中</TabsTrigger>
            <TabsTrigger value="paused">已暂停</TabsTrigger>
            <TabsTrigger value="error">错误</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          新建策略
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>套利策略列表</CardTitle>
          <CardDescription>
            管理您的自动套利策略，查看性能和收益
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">策略名称</TableHead>
                <TableHead>交易对</TableHead>
                <TableHead>交易所</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">总收益</TableHead>
                <TableHead className="text-right">成功率</TableHead>
                <TableHead className="text-right">最近执行</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredStrategies().map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell>
                    <div className="font-medium">{strategy.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{strategy.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {strategy.pairs.map((pair, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pair}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {strategy.exchanges.map((exchange, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {exchange}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(strategy.status)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                    +${strategy.totalProfit.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {strategy.successRate}%
                    <div className="text-xs text-muted-foreground">
                      {strategy.tradesCount}次交易
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatTimeAgo(strategy.lastExecuted)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {strategy.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleStrategyStatus(strategy.id)}
                        >
                          <PauseIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={strategy.status === 'error'}
                          onClick={() => toggleStrategyStatus(strategy.id)}
                        >
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <SettingsIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
