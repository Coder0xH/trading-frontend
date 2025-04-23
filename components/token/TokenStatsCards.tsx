'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SyncStatusResponse } from '@/app/api/token/service';

interface TokenStatsCardsProps {
  readonly syncStatus: SyncStatusResponse | null;
  readonly formatDate: (dateString: string | null) => string;
}

/**
 * 代币统计信息卡片组件
 * 显示代币总数、有合约地址的代币数量和最后同步时间
 */
export function TokenStatsCards({ syncStatus, formatDate }: TokenStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>代币总数</CardTitle>
          <CardDescription>系统中的代币总数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {syncStatus ? syncStatus.total_tokens : <Skeleton className="h-8 w-20" />}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>有合约地址的代币</CardTitle>
          <CardDescription>具有合约地址的代币数量</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {syncStatus ? syncStatus.tokens_with_contract : <Skeleton className="h-8 w-20" />}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>最后同步时间</CardTitle>
          <CardDescription>上次同步代币数据的时间</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium">
            {syncStatus ? formatDate(syncStatus.last_synced_at) : <Skeleton className="h-8 w-40" />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
