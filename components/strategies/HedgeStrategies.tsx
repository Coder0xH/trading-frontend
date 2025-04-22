'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  PlusIcon, 
  PlayIcon, 
  PauseIcon, 
  TrashIcon,
  PencilIcon,
  BarChart3Icon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';

/**
 * 模拟对冲策略数据
 */
const mockHedgeStrategies = [
  { 
    id: '1', 
    name: 'ETH-USDT 跨所对冲', 
    buyExchange: 'BN永续合约', 
    sellExchange: 'BYBIT合约', 
    buySymbol: 'ETH/USDT', 
    sellSymbol: 'ETH/USDT', 
    minAmount: 100, 
    maxAmount: 500, 
    maxPosition: 2000, 
    bidirectional: true, 
    openSpread: 3, 
    flatSpread: -11, 
    buyAccount: '币安1111', 
    sellAccount: 'bybit1', 
    status: 'active', 
    profit: 245.75, 
    tradesCount: 18, 
    lastExecuted: new Date().getTime() - 1800000 
  },
  { 
    id: '2', 
    name: 'BTC-USDT 对冲策略', 
    buyExchange: 'BYBIT合约', 
    sellExchange: 'BN永续合约', 
    buySymbol: 'BTC/USDT', 
    sellSymbol: 'BTC/USDT', 
    minAmount: 50, 
    maxAmount: 200, 
    maxPosition: 1000, 
    bidirectional: false, 
    openSpread: 5, 
    flatSpread: -15, 
    buyAccount: 'bybit1', 
    sellAccount: '币安1111', 
    status: 'paused', 
    profit: 450.25, 
    tradesCount: 12, 
    lastExecuted: new Date().getTime() - 12 * 60 * 60 * 1000 
  },
  { 
    id: '3', 
    name: 'SOL-USDT 对冲', 
    buyExchange: 'BN永续合约', 
    sellExchange: 'OKX合约', 
    buySymbol: 'SOL/USDT', 
    sellSymbol: 'SOL/USDT', 
    minAmount: 200, 
    maxAmount: 800, 
    maxPosition: 3000, 
    bidirectional: true, 
    openSpread: 2, 
    flatSpread: -8, 
    buyAccount: '币安1111', 
    sellAccount: 'OKX1', 
    status: 'error', 
    profit: 80.50, 
    tradesCount: 5, 
    lastExecuted: new Date().getTime() - 5 * 60 * 60 * 1000 
  },
];

/**
 * 对冲策略组件
 */
export function HedgeStrategies() {
  const [strategies, setStrategies] = useState(mockHedgeStrategies);
  const [isCreating, setIsCreating] = useState(false);
  
  // 新策略表单状态
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    buyExchange: '',
    sellExchange: '',
    buySymbol: '',
    sellSymbol: '',
    minAmount: 100,
    maxAmount: 500,
    maxPosition: 2000,
    bidirectional: true,
    openSpread: 3,
    flatSpread: -11,
    buyAccount: '',
    sellAccount: ''
  });

  /**
   * 格式化时间戳为相对时间
   * @param timestamp - 时间戳（毫秒）
   * @returns 格式化后的相对时间字符串
   */
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}秒前`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  /**
   * 根据策略状态获取状态徽章
   * @param status - 策略状态
   * @returns 状态徽章JSX元素
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            运行中
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
            <PauseIcon className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            错误
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            未知
          </Badge>
        );
    }
  };

  /**
   * 添加新策略
   */
  const addStrategy = () => {
    // 在实际应用中，这里会调用API保存数据
    const newId = (strategies.length + 1).toString();
    setStrategies([...strategies, { 
      id: newId, 
      ...newStrategy,
      status: 'paused',
      profit: 0,
      tradesCount: 0,
      lastExecuted: new Date().getTime()
    }]);
    
    // 重置表单并关闭创建界面
    setNewStrategy({
      name: '',
      buyExchange: '',
      sellExchange: '',
      buySymbol: '',
      sellSymbol: '',
      minAmount: 100,
      maxAmount: 500,
      maxPosition: 2000,
      bidirectional: true,
      openSpread: 3,
      flatSpread: -11,
      buyAccount: '',
      sellAccount: ''
    });
    setIsCreating(false);
  };

  /**
   * 删除策略
   * @param id - 要删除的策略ID
   */
  const deleteStrategy = (id: string) => {
    // 在实际应用中，这里会调用API删除数据
    setStrategies(strategies.filter(strategy => strategy.id !== id));
  };

  /**
   * 切换策略状态
   * @param id - 策略ID
   */
  const toggleStrategyStatus = (id: string) => {
    setStrategies(strategies.map(strategy => {
      if (strategy.id === id) {
        const newStatus = strategy.status === 'active' ? 'paused' : 'active';
        return { ...strategy, status: newStatus };
      }
      return strategy;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">对冲策略</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          新建对冲
        </Button>
      </div>

      {/* 创建新策略表单 */}
      {isCreating && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>新建对冲</CardTitle>
            <CardDescription>
              创建新的对冲策略，设置交易参数
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strategy-name">策略名称</Label>
                  <Input 
                    id="strategy-name" 
                    placeholder="输入策略名称" 
                    value={newStrategy.name}
                    onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buy-exchange">买交易所名称</Label>
                    <Select 
                      value={newStrategy.buyExchange}
                      onValueChange={(value) => setNewStrategy({...newStrategy, buyExchange: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择交易所" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BN永续合约">BN永续合约</SelectItem>
                        <SelectItem value="BYBIT合约">BYBIT合约</SelectItem>
                        <SelectItem value="OKX合约">OKX合约</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sell-exchange">卖交易所名称</Label>
                    <Select 
                      value={newStrategy.sellExchange}
                      onValueChange={(value) => setNewStrategy({...newStrategy, sellExchange: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择交易所" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BN永续合约">BN永续合约</SelectItem>
                        <SelectItem value="BYBIT合约">BYBIT合约</SelectItem>
                        <SelectItem value="OKX合约">OKX合约</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buy-symbol">买币种</Label>
                    <Select 
                      value={newStrategy.buySymbol}
                      onValueChange={(value) => setNewStrategy({...newStrategy, buySymbol: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择币种" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                        <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                        <SelectItem value="AVAX/USDT">AVAX/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sell-symbol">卖币种</Label>
                    <Select 
                      value={newStrategy.sellSymbol}
                      onValueChange={(value) => setNewStrategy({...newStrategy, sellSymbol: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择币种" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                        <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                        <SelectItem value="AVAX/USDT">AVAX/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-amount">最小交易额</Label>
                    <Input 
                      id="min-amount" 
                      type="number"
                      placeholder="最小交易额" 
                      value={newStrategy.minAmount}
                      onChange={(e) => setNewStrategy({...newStrategy, minAmount: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-amount">最大交易额</Label>
                    <Input 
                      id="max-amount" 
                      type="number"
                      placeholder="最大交易额" 
                      value={newStrategy.maxAmount}
                      onChange={(e) => setNewStrategy({...newStrategy, maxAmount: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-position">最大持仓额</Label>
                  <Input 
                    id="max-position" 
                    type="number"
                    placeholder="最大持仓额" 
                    value={newStrategy.maxPosition}
                    onChange={(e) => setNewStrategy({...newStrategy, maxPosition: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>双向添加</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="bidirectional" 
                      checked={newStrategy.bidirectional}
                      onCheckedChange={(checked) => setNewStrategy({...newStrategy, bidirectional: checked})}
                    />
                    <Label htmlFor="bidirectional">{newStrategy.bidirectional ? '开启' : '关闭'}</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="open-spread">开仓差价</Label>
                    <Input 
                      id="open-spread" 
                      type="number"
                      placeholder="开仓差价" 
                      value={newStrategy.openSpread}
                      onChange={(e) => setNewStrategy({...newStrategy, openSpread: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="flat-spread">平仓差价</Label>
                    <Input 
                      id="flat-spread" 
                      type="number"
                      placeholder="平仓差价" 
                      value={newStrategy.flatSpread}
                      onChange={(e) => setNewStrategy({...newStrategy, flatSpread: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buy-account">买账号</Label>
                    <Select 
                      value={newStrategy.buyAccount}
                      onValueChange={(value) => setNewStrategy({...newStrategy, buyAccount: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择账号" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="币安1111">币安1111</SelectItem>
                        <SelectItem value="bybit1">bybit1</SelectItem>
                        <SelectItem value="OKX1">OKX1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sell-account">卖账号</Label>
                    <Select 
                      value={newStrategy.sellAccount}
                      onValueChange={(value) => setNewStrategy({...newStrategy, sellAccount: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择账号" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="币安1111">币安1111</SelectItem>
                        <SelectItem value="bybit1">bybit1</SelectItem>
                        <SelectItem value="OKX1">OKX1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                取消
              </Button>
              <Button onClick={addStrategy}>
                提交
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 策略列表 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>对冲策略列表</CardTitle>
          <CardDescription>
            管理您的对冲策略，查看性能和收益
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">策略名称</TableHead>
                <TableHead>交易对</TableHead>
                <TableHead>交易所</TableHead>
                <TableHead>差价设置</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">总收益</TableHead>
                <TableHead className="text-right">最近执行</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell className="font-medium">{strategy.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs">
                        {strategy.buySymbol}
                      </Badge>
                      {strategy.buySymbol !== strategy.sellSymbol && (
                        <Badge variant="outline" className="text-xs">
                          {strategy.sellSymbol}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground flex items-center">
                        买: {strategy.buyExchange}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        卖: {strategy.sellExchange}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">
                        开仓: {strategy.openSpread}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        平仓: {strategy.flatSpread}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(strategy.status)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                    +${strategy.profit.toFixed(2)}
                    <div className="text-xs text-muted-foreground">
                      {strategy.tradesCount}次交易
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatTimeAgo(strategy.lastExecuted)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {strategy.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleStrategyStatus(strategy.id)}
                        >
                          <PauseIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={strategy.status === 'error'}
                          onClick={() => toggleStrategyStatus(strategy.id)}
                        >
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3Icon className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500"
                        onClick={() => deleteStrategy(strategy.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
