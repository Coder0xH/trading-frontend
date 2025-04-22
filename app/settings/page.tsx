'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DatabaseIcon,
  KeyIcon,
  PercentIcon
} from 'lucide-react';
import { ExchangePlatformManager } from "@/components/exchange/ExchangePlatformManager";
import { ApiManager } from "@/components/exchange/ApiManager";
import { FeeManager } from "@/components/exchange/FeeManager";

/**
 * 模拟交易所数据
 */
const mockExchanges = [
  { id: 1, name: 'BYBIT', isVerified: true, extendField: '-', marker: '-bybit1' },
  { id: 2, name: 'BITGET', isVerified: false, extendField: '-', marker: '-bitget1' },
  { id: 3, name: '火币', isVerified: false, extendField: '-', marker: '-火币1' },
  { id: 4, name: 'OK', isVerified: false, extendField: '-', marker: '-OKX1' },
  { id: 5, name: 'HYPE', isVerified: false, extendField: '-', marker: '-hype1' },
  { id: 6, name: '币安', isVerified: false, extendField: '-', marker: '-币安1111' },
  { id: 7, name: 'BITGET', isVerified: false, extendField: '-', marker: '-bitget新' },
];

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

      <Tabs defaultValue="exchanges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exchanges" className="flex items-center">
            <DatabaseIcon className="mr-2 h-4 w-4" />
            交易平台管理
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center">
            <KeyIcon className="mr-2 h-4 w-4" />
            API管理
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center">
            <PercentIcon className="mr-2 h-4 w-4" />
            手续费设置
          </TabsTrigger>
        </TabsList>
        
        {/* 交易平台管理 */}
        <TabsContent value="exchanges" className="mt-4">
          <ExchangePlatformManager initialExchanges={mockExchanges} />
        </TabsContent>
        
        {/* API管理 */}
        <TabsContent value="api" className="mt-4">
          <ApiManager initialExchanges={mockExchanges} />
        </TabsContent>
        
        {/* 手续费设置 */}
        <TabsContent value="fees" className="mt-4">
          <FeeManager initialFees={mockFees} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
