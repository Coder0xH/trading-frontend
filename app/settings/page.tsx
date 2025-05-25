'use client';

import { IntegratedExchangeManager } from "@/components/exchange/IntegratedExchangeManager";

/**
 * 交易所设置页面组件
 * 管理交易所账户、API密钥和交易手续费
 */
export default function ExchangeSettingsPage() {
  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-6 py-4 md:py-6">
      <div className="flex flex-col gap-1 md:gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">账户设置</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          管理账户, Dex 和 API 密钥。
        </p>
      </div>

      {/* 交易所和API密钥管理（整合版） */}
      <IntegratedExchangeManager />
    </div>
  );
}
