'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedPriceProps, PriceDirection } from '@/types/price';

/**
 * 格式化价格显示的工具函数
 * @param price 价格数值
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price?: number) => {
  if (price === undefined) return '暂无数据';
  return price.toLocaleString('zh-CN', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * 动画价格组件 - 根据价格变化方向显示不同的动画效果
 */
export function AnimatedPrice({ value, className = '', direction = 'neutral', color }: Readonly<AnimatedPriceProps>) {
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
  
  // 如果提供了自定义颜色，则使用内联样式
  const customStyle = color ? { color } : {};
  
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value?.toString() ?? 'no-value'}
        initial={{ opacity: 0, y: initialYOffset }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: exitYOffset }}
        transition={{ duration: 0.3 }}
        className={`${className} ${directionClass}`}
        style={customStyle}
      >
        {value === undefined || value === null ? '暂无数据' : formatPrice(value)}
      </motion.span>
    </AnimatePresence>
  );
}
