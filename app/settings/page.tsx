'use client';

import { IntegratedExchangeManager } from "@/components/exchange/IntegratedExchangeManager";
// import { FeeManager } from "@/components/exchange/FeeManager";

/**
 * 模拟手续费数据
 */
const mockFees = [
  { id: 1, exchange: '币安现货', fee: 0.000075 },
  { id: 2, exchange: '币安合约', fee: 0.00005 },
  { id: 3, exchange: '火币现货', fee: 0.00017 },
  { id: 4, exchange: '火币合约', fee: 0.000055 },
];

/**
 * 交易所设置页面组件
 * 管理交易所账户、API密钥和交易手续费
 */
export default function ExchangeSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">交易所设置</h1>
        <p className="text-muted-foreground">
          管理您的交易所账户、API密钥和交易手续费。
        </p>
      </div>

      {/* 交易所和API密钥管理（整合版） */}
      <IntegratedExchangeManager />
      
      {/* 手续费设置 */}
      {/* <FeeManager initialFees={mockFees} /> */}
    </div>
  );
}
