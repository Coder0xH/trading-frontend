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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCwIcon, 
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircleIcon,
  BarChart3Icon,
  LineChartIcon
} from 'lucide-react';

/**
 * 模拟市场数据
 */
const mockMarketData = {
  topGainers: [
    { symbol: 'SOL/USDT', price: 145.50, change: 8.75, volume: 1250000000 },
    { symbol: 'AVAX/USDT', price: 29.45, change: 6.23, volume: 420000000 },
    { symbol: 'LINK/USDT', price: 15.55, change: 5.87, volume: 320000000 },
    { symbol: 'MATIC/USDT', price: 0.85, change: 4.95, volume: 180000000 },
    { symbol: 'DOT/USDT', price: 7.25, change: 4.62, volume: 210000000 },
  ],
  topLosers: [
    { symbol: 'DOGE/USDT', price: 0.12, change: -5.25, volume: 680000000 },
    { symbol: 'ADA/USDT', price: 0.45, change: -4.87, volume: 520000000 },
    { symbol: 'XRP/USDT', price: 0.58, change: -3.65, volume: 890000000 },
    { symbol: 'UNI/USDT', price: 6.75, change: -3.42, volume: 150000000 },
    { symbol: 'ATOM/USDT', price: 8.95, change: -2.85, volume: 95000000 },
  ],
  highVolume: [
    { symbol: 'BTC/USDT', price: 63750.25, change: 1.25, volume: 12500000000 },
    { symbol: 'ETH/USDT', price: 3520.75, change: 2.04, volume: 8500000000 },
    { symbol: 'XRP/USDT', price: 0.58, change: -3.65, volume: 890000000 },
    { symbol: 'DOGE/USDT', price: 0.12, change: -5.25, volume: 680000000 },
    { symbol: 'ADA/USDT', price: 0.45, change: -4.87, volume: 520000000 },
  ],
  volatility: [
    { symbol: 'SOL/USDT', price: 145.50, change: 8.75, volatility: 12.5 },
    { symbol: 'DOGE/USDT', price: 0.12, change: -5.25, volatility: 10.8 },
    { symbol: 'AVAX/USDT', price: 29.45, change: 6.23, volatility: 9.7 },
    { symbol: 'ADA/USDT', price: 0.45, change: -4.87, volatility: 8.9 },
    { symbol: 'LINK/USDT', price: 15.55, change: 5.87, volatility: 8.2 },
  ],
  marketIndices: [
    { name: '加密恐惧贪婪指数', value: 72, status: '贪婪', change: 5 },
    { name: '比特币主导度', value: 52.5, status: '中等', change: -0.8 },
    { name: '总市值', value: 2.45, unit: '万亿', change: 1.2 },
    { name: '24h总成交量', value: 125.8, unit: '十亿', change: 3.5 },
    { name: 'DeFi总锁仓量', value: 85.2, unit: '十亿', change: 2.1 },
  ],
  alerts: [
    { id: '1', symbol: 'BTC/USDT', type: 'price', condition: '> 65000', exchange: 'Binance', createdAt: new Date().getTime() - 2 * 60 * 60 * 1000 },
    { id: '2', symbol: 'ETH/USDT', type: 'volatility', condition: '> 5%', exchange: 'OKX', createdAt: new Date().getTime() - 5 * 60 * 60 * 1000 },
    { id: '3', symbol: 'SOL/USDT', type: 'volume', condition: '> 2B', exchange: '所有', createdAt: new Date().getTime() - 12 * 60 * 60 * 1000 },
  ]
};

/**
 * 市场监控页面组件
 */
export default function MonitorPage() {
  // 使用 useState 但不解构 setter，因为目前未使用
  const [marketData] = useState(mockMarketData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  /**
   * 模拟刷新市场数据
   */
  const refreshMarketData = () => {
    setIsRefreshing(true);
    // 模拟API请求延迟
    setTimeout(() => {
      // 在实际应用中，这里会调用API获取最新数据
      setIsRefreshing(false);
    }, 1000);
  };

  /**
   * 格式化大数字（K, M, B）
   * @param value - 要格式化的数值
   * @returns 格式化后的字符串
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">市场监控</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshMarketData}
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
        <p className="text-muted-foreground">
          实时监控市场动态，跟踪价格变化和交易量趋势。
        </p>
      </div>

      {/* 市场指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {marketData.marketIndices.map((index, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {index.value}{index.unit || ''}
                </div>
                <Badge 
                  variant={index.change > 0 ? "outline" : "secondary"}
                  className={index.change > 0 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" 
                    : ""}
                >
                  {index.change > 0 ? '+' : ''}{index.change}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {index.status || ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 市场数据标签页 */}
      <Tabs defaultValue="gainers" className="w-full">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="gainers" className="flex items-center">
            <TrendingUpIcon className="mr-2 h-4 w-4 text-green-500" />
            涨幅榜
          </TabsTrigger>
          <TabsTrigger value="losers" className="flex items-center">
            <TrendingDownIcon className="mr-2 h-4 w-4 text-red-500" />
            跌幅榜
          </TabsTrigger>
          <TabsTrigger value="volume" className="flex items-center">
            <BarChart3Icon className="mr-2 h-4 w-4" />
            成交量榜
          </TabsTrigger>
          <TabsTrigger value="volatility" className="flex items-center">
            <LineChartIcon className="mr-2 h-4 w-4" />
            波动率榜
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gainers" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>涨幅榜</CardTitle>
              <CardDescription>
                24小时内涨幅最大的加密货币
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {marketData.topGainers.map((coin, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-1 bg-green-500"></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold">{coin.symbol}</div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                          +{coin.change}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">${coin.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        成交量: ${formatLargeNumber(coin.volume)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="losers" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>跌幅榜</CardTitle>
              <CardDescription>
                24小时内跌幅最大的加密货币
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {marketData.topLosers.map((coin, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-1 bg-red-500"></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold">{coin.symbol}</div>
                        <Badge variant="destructive">
                          {coin.change}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">${coin.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        成交量: ${formatLargeNumber(coin.volume)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volume" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>成交量榜</CardTitle>
              <CardDescription>
                24小时内成交量最大的加密货币
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {marketData.highVolume.map((coin, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-1 bg-blue-500"></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold">{coin.symbol}</div>
                        <Badge 
                          variant={coin.change > 0 ? "outline" : "destructive"}
                          className={coin.change > 0 
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" 
                            : ""}
                        >
                          {coin.change > 0 ? '+' : ''}{coin.change}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">${coin.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium">
                        成交量: ${formatLargeNumber(coin.volume)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volatility" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>波动率榜</CardTitle>
              <CardDescription>
                24小时内波动率最大的加密货币
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {marketData.volatility.map((coin, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-1 bg-purple-500"></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold">{coin.symbol}</div>
                        <Badge 
                          variant={coin.change > 0 ? "outline" : "destructive"}
                          className={coin.change > 0 
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" 
                            : ""}
                        >
                          {coin.change > 0 ? '+' : ''}{coin.change}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">${coin.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        波动率: {coin.volatility}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 价格提醒 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>价格提醒</CardTitle>
            <Button size="sm">
              <AlertCircleIcon className="mr-2 h-4 w-4" />
              添加提醒
            </Button>
          </div>
          <CardDescription>
            设置价格、波动率或成交量提醒
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketData.alerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold">{alert.symbol}</div>
                    <Badge variant="outline">
                      {alert.exchange}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {alert.type === 'price' && '价格'}
                      {alert.type === 'volatility' && '波动率'}
                      {alert.type === 'volume' && '成交量'}
                    </Badge>
                    <span className="text-sm font-medium">{alert.condition}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-3">
                    创建于 {formatTimeAgo(alert.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
