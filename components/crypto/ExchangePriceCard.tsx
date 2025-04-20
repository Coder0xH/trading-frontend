'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { PriceCardProps, exchangeColors } from '@/types/price';
import { AnimatedPrice } from './AnimatedPrice';

/**
 * 交易所价格卡片组件 - 显示单个交易所的价格信息
 */
export function ExchangePriceCard({ exchange, exchangeName, price, isHigh, isLow, loading, direction }: Readonly<PriceCardProps>) {
  // 获取交易所品牌颜色
  const brandColor = exchangeColors[exchangeName];
  
  // 根据价格状态设置样式
  let priceClass = 'text-xl font-bold';
  if (isHigh) priceClass += ' text-green-600 dark:text-green-400';
  else if (isLow) priceClass += ' text-red-600 dark:text-red-400';

  // 为 OKX 设置特殊的文字颜色，因为黑色在深色模式下不可见
  const textColor = exchangeName === 'okx' && brandColor === '#000000' 
    ? { color: 'currentColor' } 
    : { color: brandColor };
    
  // logo 文件名映射
  const logoFileMap: Record<string, string> = {
    'binance': 'binance.png',
    'okx': 'okx.png',
    'bitget': 'bitget.png', 
    'bybit': 'bybit.png'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      style={{ borderTop: `3px solid ${brandColor}` }}
    >
      <div className="flex items-center mb-3 border-b pb-2 border-gray-200 dark:border-gray-600">
        {/* 交易所 Logo */}
        <div className="w-8 h-8 rounded-md flex items-center justify-center mr-2 overflow-hidden">
          <Image 
            src={`/images/${logoFileMap[exchangeName]}`}
            alt={`${exchange} logo`}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        
        {/* 交易所名称 */}
        <h3 
          className="text-lg font-medium"
          style={textColor}
        >
          {exchange}
        </h3>
      </div>
      
      <div className={priceClass}>
        {loading ? (
          <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
        ) : (
          <AnimatedPrice 
            value={price} 
            direction={direction} 
            color={exchangeName === 'okx' ? undefined : brandColor} 
          />
        )}
      </div>
      <div className="mt-2 flex items-center">
        {/* 显示最高/最低价标签 */}
        {isHigh && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">最高价</span>}
        {isLow && <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">最低价</span>}
        
        {/* 价格上涨指示器 */}
        {direction === 'up' && !loading && price !== undefined && (
          <span className="ml-auto text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </span>
        )}
        
        {/* 价格下跌指示器 */}
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
