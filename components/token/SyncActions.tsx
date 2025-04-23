'use client';

import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface SyncActionsProps {
  readonly syncLoading: boolean;
  readonly onSyncTokens: () => Promise<void>;
  readonly onSyncUsdtPairs: () => Promise<void>;
}

/**
 * 同步操作按钮组件
 * 提供同步代币信息和同步USDT交易对的功能
 */
export function SyncActions({ syncLoading, onSyncTokens, onSyncUsdtPairs }: SyncActionsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Button 
        onClick={onSyncTokens} 
        disabled={syncLoading}
      >
        {syncLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        同步代币信息
      </Button>
      
      <Button 
        onClick={onSyncUsdtPairs} 
        disabled={syncLoading}
        variant="outline"
      >
        {syncLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        同步USDT交易对
      </Button>
    </div>
  );
}
