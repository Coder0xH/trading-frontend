'use client';

import { StrategyManager } from "@/components/strategies/StrategyManager";

/**
 * 策略管理页面组件
 */
export default function StrategiesPage() {
  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-6 py-4 md:py-6">
      <div className="flex flex-col gap-1 md:gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">策略管理</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          管理和监控您的自动交易策略，设置参数并跟踪收益。
        </p>
      </div>

      {/* 策略组件 */}
      <StrategyManager />
    </div>
  );
}
