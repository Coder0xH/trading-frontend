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
import { Input } from "@/components/ui/input";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  SearchIcon,
  FilterIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DownloadIcon
} from 'lucide-react';

/**
 * 模拟交易记录数据
 */
const mockTradeHistory = [
  {
    id: '1',
    strategyName: 'ETH-USDT 跨所套利',
    buyExchange: 'Binance',
    sellExchange: 'OKX',
    symbol: 'ETH/USDT',
    buyPrice: 3450.25,
    sellPrice: 3520.75,
    amount: 0.5,
    profit: 35.25,
    profitPercentage: 2.04,
    status: 'completed',
    timestamp: new Date().getTime() - 2 * 60 * 60 * 1000,
    txHash: '0x8a7d953a2bd916e2f6322a809f7c6e83c8d3b9e8a7d953a2bd916e2',
  },
  {
    id: '2',
    strategyName: 'BTC 三角套利',
    buyExchange: 'Binance',
    sellExchange: 'Binance',
    symbol: 'BTC/USDT -> BTC/ETH -> ETH/USDT',
    buyPrice: 63250.50,
    sellPrice: 63750.25,
    amount: 0.05,
    profit: 24.99,
    profitPercentage: 0.79,
    status: 'completed',
    timestamp: new Date().getTime() - 5 * 60 * 60 * 1000,
    txHash: '0x7c6e83c8d3b9e8a7d953a2bd916e2f6322a809f7c6e83c8d3b9e8',
  },
  {
    id: '3',
    strategyName: 'SOL 闪电套利',
    buyExchange: 'Jupiter',
    sellExchange: 'Raydium',
    symbol: 'SOL/USDC',
    buyPrice: 142.25,
    sellPrice: 145.50,
    amount: 2.5,
    profit: 8.13,
    profitPercentage: 2.28,
    status: 'failed',
    timestamp: new Date().getTime() - 12 * 60 * 60 * 1000,
    txHash: '0x2bd916e2f6322a809f7c6e83c8d3b9e8a7d953a2bd916e2f6322',
    errorMessage: '交易执行超时',
  },
  {
    id: '4',
    strategyName: '稳定币套利',
    buyExchange: 'Binance',
    sellExchange: 'OKX',
    symbol: 'USDT/USDC -> USDC/DAI -> DAI/USDT',
    buyPrice: 0.9985,
    sellPrice: 1.0015,
    amount: 5000,
    profit: 15.00,
    profitPercentage: 0.30,
    status: 'completed',
    timestamp: new Date().getTime() - 24 * 60 * 60 * 1000,
    txHash: '0x6322a809f7c6e83c8d3b9e8a7d953a2bd916e2f6322a809f7c6e',
  },
  {
    id: '5',
    strategyName: 'ETH-USDT 跨所套利',
    buyExchange: 'Binance',
    sellExchange: 'OKX',
    symbol: 'ETH/USDT',
    buyPrice: 3460.50,
    sellPrice: 3510.25,
    amount: 0.75,
    profit: 37.31,
    profitPercentage: 1.44,
    status: 'completed',
    timestamp: new Date().getTime() - 36 * 60 * 60 * 1000,
    txHash: '0x83c8d3b9e8a7d953a2bd916e2f6322a809f7c6e83c8d3b9e8a7d',
  },
];

/**
 * 格式化时间戳为日期时间
 * @param timestamp - 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串
 */
const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * 交易记录页面组件
 */
export default function HistoryPage() {
  // 使用 useState 但不解构 setter，因为目前未使用
  const [tradeHistory] = useState(mockTradeHistory);
  const [searchTerm, setSearchTerm] = useState('');
  
  /**
   * 根据交易状态获取状态徽章
   * @param status - 交易状态
   * @returns 状态徽章JSX元素
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            成功
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircleIcon className="h-3 w-3 mr-1" />
            失败
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
   * 过滤交易记录
   * @returns 过滤后的交易记录
   */
  const getFilteredTradeHistory = () => {
    if (!searchTerm) return tradeHistory;
    
    return tradeHistory.filter(trade => 
      trade.strategyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.buyExchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.sellExchange.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  /**
   * 计算总收益
   * @returns 总收益
   */
  const getTotalProfit = () => {
    return tradeHistory
      .filter(trade => trade.status === 'completed')
      .reduce((sum, trade) => sum + trade.profit, 0);
  };

  /**
   * 计算成功率
   * @returns 成功率百分比
   */
  const getSuccessRate = () => {
    const completedTrades = tradeHistory.filter(trade => trade.status === 'completed').length;
    return (completedTrades / tradeHistory.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">交易记录</h1>
        <p className="text-muted-foreground">
          查看所有套利交易的历史记录和详细信息。
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总交易次数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tradeHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              最近30天内的所有交易
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总收益</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              +${getTotalProfit().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              所有成功交易的累计收益
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getSuccessRate().toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              成功完成的交易百分比
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索交易记录..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <FilterIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <DownloadIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* 交易记录表格 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>交易记录</CardTitle>
          <CardDescription>
            查看所有套利交易的详细信息和结果
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">策略</TableHead>
                <TableHead>交易对</TableHead>
                <TableHead>交易所</TableHead>
                <TableHead className="text-right">金额</TableHead>
                <TableHead className="text-right">买入价</TableHead>
                <TableHead className="text-right">卖出价</TableHead>
                <TableHead className="text-right">收益</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredTradeHistory().map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.strategyName}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs flex items-center">
                        <ArrowDownIcon className="h-3 w-3 mr-1 text-green-500" />
                        {trade.buyExchange}
                      </div>
                      <div className="text-xs flex items-center">
                        <ArrowUpIcon className="h-3 w-3 mr-1 text-red-500" />
                        {trade.sellExchange}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{trade.amount}</TableCell>
                  <TableCell className="text-right">${trade.buyPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${trade.sellPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-green-600 dark:text-green-400">
                        +${trade.profit.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {trade.profitPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(trade.status)}
                    {trade.errorMessage && (
                      <div className="text-xs text-red-500 mt-1">
                        {trade.errorMessage}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {formatDateTime(trade.timestamp)}
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
