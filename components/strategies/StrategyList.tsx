'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlayIcon, 
  PauseIcon, 
  TrashIcon,
  PencilIcon,
  BarChart3Icon,
  CheckCircleIcon,
} from 'lucide-react';
import { ArbitrageStrategy, ArbitrageDirection } from '@/services/arbitrageApi';

interface StrategyListProps {
  readonly strategies: ArbitrageStrategy[];
  readonly onExecute: (id: string) => void;
  readonly onEdit: (strategy: ArbitrageStrategy) => void;
  readonly onDelete: (id: string) => void;
  readonly isLoading: boolean;
}

/**
 * 策略列表组件
 */
export function StrategyList({
  strategies,
  onExecute,
  onEdit,
  onDelete,
  isLoading
}: StrategyListProps) {
  /**
   * 格式化时间戳为相对时间
   * @param timestamp - 时间戳（毫秒）或日期字符串
   * @returns 格式化后的相对时间字符串
   */
  const formatTimeAgo = (timestamp: number | string | undefined) => {
    // 如果没有时间戳，返回默认文本
    if (!timestamp) {
      return '从未执行';
    }
    
    // 将时间戳转换为Date对象
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    // 根据时间差返回不同的格式
    if (seconds < 60) {
      return `${seconds}秒前`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}分钟前`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}小时前`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  /**
   * 获取运行中状态徽章
   * @returns 运行中状态徽章JSX元素
   */
  const getRunningStatusBadge = () => (
    <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
      <CheckCircleIcon className="h-3 w-3 mr-1" />
      运行中
    </Badge>
  );

  /**
   * 获取已暂停状态徽章
   * @returns 已暂停状态徽章JSX元素
   */
  const getPausedStatusBadge = () => (
    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
      <PauseIcon className="h-3 w-3 mr-1" />
      已暂停
    </Badge>
  );

  /**
   * 获取链上到交易所方向文本
   * @returns 链上到交易所方向文本
   */
  const getChainToExchangeText = () => '链上→交易所';

  /**
   * 获取交易所到链上方向文本
   * @returns 交易所到链上方向文本
   */
  const getExchangeToChainText = () => '交易所→链上';

  /**
   * 根据方向获取方向文本
   * @param direction - 交易方向
   * @returns 交易方向文本
   */
  const getDirectionText = (direction?: string) => {
    return direction === ArbitrageDirection.CHAIN_TO_EXCHANGE 
      ? getChainToExchangeText() 
      : getExchangeToChainText();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (strategies.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">策略名称</TableHead>
          <TableHead>交易对</TableHead>
          <TableHead>交易所</TableHead>
          <TableHead>方向</TableHead>
          <TableHead>价差设置</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className="text-right">最近执行</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {strategies.map((strategy) => (
          <TableRow key={strategy.id}>
            <TableCell className="font-medium">{strategy.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {strategy.symbol}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">
                  买: {strategy.buy_exchange}
                </div>
                <div className="text-xs text-muted-foreground">
                  卖: {strategy.sell_exchange}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-xs">
                {getDirectionText(strategy.direction)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">
                  开仓: {strategy.open_price_diff}%
                </div>
                <div className="text-xs text-muted-foreground">
                  平仓: {strategy.close_price_diff ?? strategy.open_price_diff}%
                </div>
              </div>
            </TableCell>
            <TableCell>
              {strategy.enabled ? getRunningStatusBadge() : getPausedStatusBadge()}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {formatTimeAgo(strategy.last_execution ?? undefined)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onExecute(strategy.id)}
                >
                  <PlayIcon className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit(strategy)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart3Icon className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-500"
                  onClick={() => onDelete(strategy.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
