'use client';

import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BinanceTokenResponse } from '@/api/token/service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface TokenTableProps {
  readonly tokens: readonly BinanceTokenResponse[];
  readonly loading: boolean;
  readonly page: number;
  readonly getNetworkCount: (token: BinanceTokenResponse) => number;
  readonly getFirstNetworkAndAddress: (token: BinanceTokenResponse) => { network: string, address: string } | null;
  readonly formatDate: (dateString: string | null) => string;
  readonly onSelectToken: (token: BinanceTokenResponse) => void;
}

/**
 * 代币表格组件
 * 显示代币列表数据
 */
export function TokenTable({ 
  tokens, 
  loading, 
  page, 
  getNetworkCount, 
  getFirstNetworkAndAddress, 
  formatDate,
  onSelectToken
}: TokenTableProps) {
  /**
   * 渲染加载状态的骨架屏
   */
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${Math.random().toString(36).substring(2, 11)}-${index}`}>
        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      </TableRow>
    ));
  };

  /**
   * 渲染空数据状态
   */
  const renderEmptyState = () => {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-4">
          没有找到代币数据
        </TableCell>
      </TableRow>
    );
  };

  /**
   * 渲染代币列表
   */
  const renderTokens = () => {
    return tokens.map((token) => (
      <TableRow key={token.id}>
        <TableCell>{token.id}</TableCell>
        <TableCell className="font-medium">{token.coin}</TableCell>
        <TableCell>
          <div className="max-w-[150px] truncate" title={token.name ?? '-'}>
            {token.name ?? '-'}
          </div>
        </TableCell>
        <TableCell>
          {token.exchange ? (
            <Badge variant="outline">{token.exchange}</Badge>
          ) : '-'}
        </TableCell>
        <TableCell>
          {token.usdt_trading_pair ? (
            <Badge variant="outline">{token.usdt_trading_pair}</Badge>
          ) : '-'}
        </TableCell>
        <TableCell>
          {token.has_contract_address ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => onSelectToken(token)}
            >
              {(() => {
                const networkCount = getNetworkCount(token);
                const firstNetworkAndAddress = getFirstNetworkAndAddress(token);
                
                if (networkCount === 0) {
                  return <span className="text-xs text-muted-foreground">无合约地址</span>;
                }
                
                return (
                  <div className="flex items-center">
                    {firstNetworkAndAddress && (
                      <>
                        <Badge variant="outline" className="mr-1">{firstNetworkAndAddress.network.toUpperCase()}</Badge>
                        <span className="text-xs font-mono truncate max-w-[100px]" title={firstNetworkAndAddress.address}>
                          {firstNetworkAndAddress.address.substring(0, 6)}...
                        </span>
                      </>
                    )}
                    {networkCount > 1 && (
                      <Badge variant="secondary" className="ml-1">+{networkCount - 1}</Badge>
                    )}
                    <ExternalLink className="ml-1 h-3 w-3 text-muted-foreground" />
                  </div>
                );
              })()}
            </Button>
          ) : '-'}
        </TableCell>
        <TableCell>
          {token.trading ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">可交易</Badge>
          ) : (
            <Badge variant="destructive">不可交易</Badge>
          )}
        </TableCell>
        <TableCell>{formatDate(token.last_synced_at)}</TableCell>
      </TableRow>
    ));
  };

  /**
   * 根据当前状态渲染表格内容
   */
  const renderTableContent = () => {
    if (loading) {
      return renderSkeletons();
    }
    
    if (tokens.length === 0) {
      return renderEmptyState();
    }
    
    return renderTokens();
  };

  return (
    <Table>
      <TableCaption>代币列表 - 第 {page} 页</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">ID</TableHead>
          <TableHead className="w-[100px]">符号</TableHead>
          <TableHead className="w-[150px]">名称</TableHead>
          <TableHead className="w-[100px]">交易所</TableHead>
          <TableHead className="w-[120px]">USDT交易对</TableHead>
          <TableHead className="w-[250px]">合约地址</TableHead>
          <TableHead className="w-[100px]">交易状态</TableHead>
          <TableHead className="w-[120px]">最后同步</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderTableContent()}
      </TableBody>
    </Table>
  );
}
