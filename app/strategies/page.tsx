'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HedgeStrategies } from "@/components/strategies/HedgeStrategies";
import { ArbitrageStrategies } from "@/components/strategies/ArbitrageStrategies";

/**
 * 策略管理页面组件
 */
export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">策略管理</h1>
        <p className="text-muted-foreground">
          管理和监控您的自动套利策略，设置参数并跟踪收益。
        </p>
      </div>

      <Tabs defaultValue="arbitrage" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="arbitrage">套利策略</TabsTrigger>
          <TabsTrigger value="hedge">对冲策略</TabsTrigger>
        </TabsList>
        
        {/* 套利策略组件 */}
        <TabsContent value="arbitrage" className="mt-4 space-y-6">
          <ArbitrageStrategies />
        </TabsContent>
        
        {/* 对冲策略组件 */}
        <TabsContent value="hedge" className="mt-4">
          <HedgeStrategies />
        </TabsContent>
      </Tabs>
    </div>
  );
}
