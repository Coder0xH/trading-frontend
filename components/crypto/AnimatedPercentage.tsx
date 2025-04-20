'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedPercentageProps } from '@/types/price';

/**
 * 动画百分比组件 - 用于显示带有动画效果的百分比数值
 */
export function AnimatedPercentage({ value, className = '' }: Readonly<AnimatedPercentageProps>) {
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
