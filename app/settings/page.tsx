'use client';

import { IntegratedExchangeManager } from "@/components/exchange/IntegratedExchangeManager";
// import { FeeManager } from "@/components/exchange/FeeManager";

/**
 * 交易所设置页面组件
 * 管理交易所账户、API密钥和交易手续费
 */
export default function ExchangeSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">账户设置</h1>
        <p className="text-muted-foreground">
          管理账户, Dex 和 API 密钥。
        </p>
      </div>

      {/* 交易所和API密钥管理（整合版） */}
      <IntegratedExchangeManager />
      
      {/* 手续费设置 */}
      {/* <FeeManager initialFees={mockFees} /> */}
    </div>
  );
}
