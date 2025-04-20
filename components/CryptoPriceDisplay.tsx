'use client';

import { useState, useEffect } from 'react';

interface PriceData {
  success: boolean;
  timestamp: string;
  prices: {
    binance?: number;
    okx?: number;
    bitget?: number;
    bybit?: number;
  };
  error?: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(1000); // 默认5秒刷新一次

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prices');
      const data = await response.json();
      
      if (data.success) {
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
    }
  };

  useEffect(() => {
    // 首次加载时获取价格
    fetchPrices();

    // 设置定时刷新
    const intervalId = setInterval(fetchPrices, refreshInterval);

    // 清理函数
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

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

  const { high, low } = calculateHighLow();
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">BTC/USDT 实时价格</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchPrices}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '加载中...' : '刷新'}
          </button>
          <div>
            <label htmlFor="refresh-interval" className="mr-2">刷新间隔:</label>
            <select 
              id="refresh-interval" 
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
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
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
          错误: {error}
        </div>
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
          />
          <PriceCard 
            exchange="OKX" 
            price={priceData?.prices?.okx} 
            isHigh={high === priceData?.prices?.okx}
            isLow={low === priceData?.prices?.okx}
            loading={loading}
          />
          <PriceCard 
            exchange="Bitget" 
            price={priceData?.prices?.bitget} 
            isHigh={high === priceData?.prices?.bitget}
            isLow={low === priceData?.prices?.bitget}
            loading={loading}
          />
          <PriceCard 
            exchange="Bybit" 
            price={priceData?.prices?.bybit} 
            isHigh={high === priceData?.prices?.bybit}
            isLow={low === priceData?.prices?.bybit}
            loading={loading}
          />
        </div>

        {/* 价格统计信息 */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">价格统计</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>最高价:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {high ? formatPrice(high) : '暂无数据'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>最低价:</span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {low ? formatPrice(low) : '暂无数据'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>价格差异:</span>
              <span className="font-bold">
                {high && low ? formatPrice(high - low) : '暂无数据'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>价格差异百分比:</span>
              <span className="font-bold">
                {high && low ? `${((high - low) / low * 100).toFixed(4)}%` : '暂无数据'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            最后更新: {priceData?.timestamp ? new Date(priceData.timestamp).toLocaleString('zh-CN') : '暂无数据'}
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
}

function PriceCard({ exchange, price, isHigh, isLow, loading }: PriceCardProps) {
  let priceClass = 'text-xl font-bold';
  if (isHigh) priceClass += ' text-green-600 dark:text-green-400';
  else if (isLow) priceClass += ' text-red-600 dark:text-red-400';

  // 显示价格
  const displayPrice = () => {
    if (loading) {
      return <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>;
    }
    return price === undefined ? '暂无数据' : formatPrice(price);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">{exchange}</h3>
      <div className={priceClass}>
        {displayPrice()}
      </div>
      {isHigh && <span className="text-xs text-green-600 dark:text-green-400">最高价</span>}
      {isLow && <span className="text-xs text-red-600 dark:text-red-400">最低价</span>}
    </div>
  );
}
