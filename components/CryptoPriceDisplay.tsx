'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 定义类型别名
type PriceDirection = 'up' | 'down' | 'neutral';
type ExchangeName = 'binance' | 'okx' | 'bitget' | 'bybit';

interface PriceData {
  readonly success: boolean;
  readonly timestamp: string;
  readonly prices: {
    readonly [key in ExchangeName]?: number;
  };
  readonly error?: string;
}

// 格式化价格显示的工具函数
const formatPrice = (price?: number) => {
  if (price === undefined) return '暂无数据';
  return price.toLocaleString('zh-CN', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export function CryptoPriceDisplay() {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [prevPriceData, setPrevPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(1000); // 默认1秒刷新一次
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 使用 useCallback 包装 fetchPrices 函数，避免在依赖数组中引起无限循环
  const fetchPrices = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/prices');
      const data = await response.json();
      
      if (data.success) {
        // 保存前一次的价格数据用于比较
        setPrevPriceData(priceData);
        setPriceData(data);
        setError(null);
      } else {
        setError(data.error ?? '获取价格失败');
      }
    } catch (err) {
      setError('获取价格时发生错误');
      console.error('获取价格错误:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [priceData]); // 添加 priceData 作为依赖项

  useEffect(() => {
    // 首次加载时获取价格
    fetchPrices();

    // 设置定时刷新
    timerRef.current = setInterval(fetchPrices, refreshInterval);

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [refreshInterval, fetchPrices]); // 添加 fetchPrices 作为依赖项

  // 当刷新间隔改变时，重置定时器
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(fetchPrices, refreshInterval);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [refreshInterval, fetchPrices]); // 添加 fetchPrices 作为依赖项

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(Number(e.target.value));
  };

  // 计算最高和最低价格
  const calculateHighLow = () => {
    if (!priceData?.prices) return { high: null, low: null };
    
    const prices = Object.values(priceData.prices).filter(p => p !== undefined);
    if (prices.length === 0) return { high: null, low: null };
    
    return {
      high: Math.max(...prices),
      low: Math.min(...prices)
    };
  };

  // 判断价格变化方向
  const getPriceChangeDirection = (exchange: ExchangeName, currentPrice?: number): PriceDirection => {
    if (!prevPriceData?.prices || !currentPrice || prevPriceData.prices[exchange] === undefined) {
      return 'neutral';
    }
    
    const prevPrice = prevPriceData.prices[exchange];
    if (prevPrice === undefined) return 'neutral';
    
    if (currentPrice > prevPrice) return 'up';
    if (currentPrice < prevPrice) return 'down';
    return 'neutral';
  };

  const { high, low } = calculateHighLow();
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">BTC/USDT 实时价格</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchPrices}
            disabled={loading || isRefreshing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-all duration-300"
          >
            {isRefreshing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中
              </span>
            ) : '刷新'}
          </button>
          <div className="flex items-center">
            <label htmlFor="refresh-interval" className="mr-2 whitespace-nowrap">刷新间隔:</label>
            <select 
              id="refresh-interval" 
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 transition-all duration-300"
            >
              <option value="1000">1秒</option>
              <option value="3000">3秒</option>
              <option value="5000">5秒</option>
              <option value="10000">10秒</option>
              <option value="30000">30秒</option>
              <option value="60000">1分钟</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-4 mb-6 bg-red-100 text-red-700 rounded-md"
        >
          错误: {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 交易所价格卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <PriceCard 
            exchange="Binance" 
            price={priceData?.prices?.binance} 
            isHigh={high === priceData?.prices?.binance}
            isLow={low === priceData?.prices?.binance}
            loading={loading}
            direction={getPriceChangeDirection('binance', priceData?.prices?.binance)}
          />
          <PriceCard 
            exchange="OKX" 
            price={priceData?.prices?.okx} 
            isHigh={high === priceData?.prices?.okx}
            isLow={low === priceData?.prices?.okx}
            loading={loading}
            direction={getPriceChangeDirection('okx', priceData?.prices?.okx)}
          />
          <PriceCard 
            exchange="Bitget" 
            price={priceData?.prices?.bitget} 
            isHigh={high === priceData?.prices?.bitget}
            isLow={low === priceData?.prices?.bitget}
            loading={loading}
            direction={getPriceChangeDirection('bitget', priceData?.prices?.bitget)}
          />
          <PriceCard 
            exchange="Bybit" 
            price={priceData?.prices?.bybit} 
            isHigh={high === priceData?.prices?.bybit}
            isLow={low === priceData?.prices?.bybit}
            loading={loading}
            direction={getPriceChangeDirection('bybit', priceData?.prices?.bybit)}
          />
        </div>

        {/* 价格统计信息 */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm transition-all duration-300">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2 border-gray-200 dark:border-gray-600">价格统计</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">最高价:</span>
              <AnimatedPrice 
                value={high} 
                className="font-bold text-green-600 dark:text-green-400"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">最低价:</span>
              <AnimatedPrice 
                value={low} 
                className="font-bold text-red-600 dark:text-red-400"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">价格差异:</span>
              <AnimatedPrice 
                value={high && low ? high - low : null} 
                className="font-bold"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">价格差异百分比:</span>
              <AnimatedPercentage 
                value={high && low ? ((high - low) / low * 100) : null} 
                className="font-bold"
              />
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-600">
            <span>最后更新:</span>
            <span>{priceData?.timestamp ? new Date(priceData.timestamp).toLocaleString('zh-CN') : '暂无数据'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PriceCardProps {
  readonly exchange: string;
  readonly price?: number;
  readonly isHigh?: boolean;
  readonly isLow?: boolean;
  readonly loading: boolean;
  readonly direction: PriceDirection;
}

function PriceCard({ exchange, price, isHigh, isLow, loading, direction }: PriceCardProps) {
  let priceClass = 'text-xl font-bold';
  if (isHigh) priceClass += ' text-green-600 dark:text-green-400';
  else if (isLow) priceClass += ' text-red-600 dark:text-red-400';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
    >
      <h3 className="text-lg font-medium mb-3 border-b pb-2 border-gray-200 dark:border-gray-600">{exchange}</h3>
      <div className={priceClass}>
        {loading ? (
          <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
        ) : (
          <AnimatedPrice value={price} direction={direction} />
        )}
      </div>
      <div className="mt-2 flex items-center">
        {isHigh && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">最高价</span>}
        {isLow && <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">最低价</span>}
        
        {direction === 'up' && !loading && price !== undefined && (
          <span className="ml-auto text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </span>
        )}
        
        {direction === 'down' && !loading && price !== undefined && (
          <span className="ml-auto text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}
      </div>
    </motion.div>
  );
}

interface AnimatedPriceProps {
  readonly value: number | null | undefined;
  readonly className?: string;
  readonly direction?: PriceDirection;
}

function AnimatedPrice({ value, className = '', direction = 'neutral' }: AnimatedPriceProps) {
  // 为不同方向设置不同的颜色
  let directionClass = '';
  if (direction === 'up') directionClass = 'text-green-600 dark:text-green-400';
  else if (direction === 'down') directionClass = 'text-red-600 dark:text-red-400';
  
  // 计算初始和退出动画的垂直位移
  const getVerticalOffset = (dir: PriceDirection): number => {
    if (dir === 'up') return 20;
    if (dir === 'down') return -20;
    return 0;
  };
  
  const initialYOffset = getVerticalOffset(direction);
  const exitYOffset = -initialYOffset; // 退出动画方向与进入相反
  
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value?.toString() ?? 'no-value'}
        initial={{ opacity: 0, y: initialYOffset }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: exitYOffset }}
        transition={{ duration: 0.3 }}
        className={`${className} ${directionClass}`}
      >
        {value === undefined || value === null ? '暂无数据' : formatPrice(value)}
      </motion.span>
    </AnimatePresence>
  );
}

interface AnimatedPercentageProps {
  readonly value: number | null | undefined;
  readonly className?: string;
}

function AnimatedPercentage({ value, className = '' }: AnimatedPercentageProps) {
  // 提取条件判断为独立变量
  const displayValue = value === undefined || value === null 
    ? '暂无数据' 
    : `${value.toFixed(4)}%`;
    
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value?.toString() ?? 'no-value'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {displayValue}
      </motion.span>
    </AnimatePresence>
  );
}
