'use client';

import { AnimatedPrice } from './AnimatedPrice';
import { AnimatedPercentage } from './AnimatedPercentage';

/**
 * 价格统计组件属性
 */
interface PriceStatisticsProps {
  high: number | null;
  low: number | null;
  timestamp: string | undefined;
}

/**
 * 价格统计组件 - 显示价格的统计信息，如最高价、最低价、价格差异等
 */
export function PriceStatistics({ high, low, timestamp }: Readonly<PriceStatisticsProps>) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm transition-all duration-300">
      <h3 className="text-xl font-semibold mb-6 border-b pb-2 border-gray-200 dark:border-gray-600">价格统计</h3>
      
      <div className="space-y-6">
        {/* 最高价 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">最高价:</span>
          <AnimatedPrice 
            value={high} 
            className="font-bold text-green-600 dark:text-green-400"
          />
        </div>
        
        {/* 最低价 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">最低价:</span>
          <AnimatedPrice 
            value={low} 
            className="font-bold text-red-600 dark:text-red-400"
          />
        </div>
        
        {/* 价格差异 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">价格差异:</span>
          <AnimatedPrice 
            value={high && low ? high - low : null} 
            className="font-bold"
          />
        </div>
        
        {/* 价格差异百分比 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">价格差异百分比:</span>
          <AnimatedPercentage 
            value={high && low ? ((high - low) / low * 100) : null} 
            className="font-bold"
          />
        </div>
      </div>
      
      {/* 最后更新时间 */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-600">
        <span>最后更新:</span>
        <span>{timestamp ? new Date(timestamp).toLocaleString('zh-CN') : '暂无数据'}</span>
      </div>
    </div>
  );
}
