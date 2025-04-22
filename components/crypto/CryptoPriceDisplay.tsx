'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExchangeName, PriceData, PriceDirection } from '@/types/price';
import { ExchangePriceCard } from './ExchangePriceCard';
import { PriceStatistics } from './PriceStatistics';

/**
 * 加密货币价格显示组件 - 主组件
 * 负责获取和显示多个交易所的加密货币价格
 */
export function CryptoPriceDisplay() {
  // 状态管理
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [prevPriceData, setPrevPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(1000); // 默认1秒刷新一次
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 获取价格数据的函数
   * 使用 useCallback 包装以避免在依赖数组中引起无限循环
   */
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

  // 首次加载和定时刷新
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

  /**
   * 处理刷新间隔变化
   */
  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(Number(e.target.value));
  };

  /**
   * 计算最高和最低价格
   */
  const calculateHighLow = () => {
    if (!priceData?.prices) return { high: null, low: null };
    
    const prices = Object.values(priceData.prices).filter(p => p !== undefined);
    if (prices.length === 0) return { high: null, low: null };
    
    return {
      high: Math.max(...prices),
      low: Math.min(...prices)
    };
  };

  /**
   * 判断价格变化方向
   */
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
  
  // 渲染主界面
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300">
      {/* 标题和控制区域 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">BTC/USDT 实时价格</h2>
        <div className="flex items-center gap-4">
          {/* 刷新按钮 */}
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
          
          {/* 刷新间隔选择器 */}
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

      {/* 错误提示 */}
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

      {/* 主内容区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 交易所价格卡片网格 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 各交易所价格卡片 */}
          <ExchangePriceCard 
            exchange="Binance" 
            exchangeName="binance"
            price={priceData?.prices?.binance} 
            isHigh={high === priceData?.prices?.binance}
            isLow={low === priceData?.prices?.binance}
            loading={loading}
            direction={getPriceChangeDirection('binance', priceData?.prices?.binance)}
          />
          <ExchangePriceCard 
            exchange="OKX" 
            exchangeName="okx"
            price={priceData?.prices?.okx} 
            isHigh={high === priceData?.prices?.okx}
            isLow={low === priceData?.prices?.okx}
            loading={loading}
            direction={getPriceChangeDirection('okx', priceData?.prices?.okx)}
          />
          <ExchangePriceCard 
            exchange="Bitget" 
            exchangeName="bitget"
            price={priceData?.prices?.bitget} 
            isHigh={high === priceData?.prices?.bitget}
            isLow={low === priceData?.prices?.bitget}
            loading={loading}
            direction={getPriceChangeDirection('bitget', priceData?.prices?.bitget)}
          />
          <ExchangePriceCard 
            exchange="Bybit" 
            exchangeName="bybit"
            price={priceData?.prices?.bybit} 
            isHigh={high === priceData?.prices?.bybit}
            isLow={low === priceData?.prices?.bybit}
            loading={loading}
            direction={getPriceChangeDirection('bybit', priceData?.prices?.bybit)}
          />
        </div>

        {/* 价格统计信息 */}
        <PriceStatistics 
          high={high} 
          low={low} 
          timestamp={priceData?.timestamp}
        />
      </div>
    </div>
  );
}
