'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArbitrageStrategyConfig,
  HedgeType,
  HedgePosition
} from '@/types/arbitrage';

interface AdvancedSettingsSectionProps {
  strategy: ArbitrageStrategyConfig;
  onStrategyChange: (updatedStrategy: Partial<ArbitrageStrategyConfig>) => void;
}

/**
 * 高级设置组件
 */
export function AdvancedSettingsSection({ 
  strategy, 
  onStrategyChange 
}: Readonly<AdvancedSettingsSectionProps>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hedge_type">对冲类型</Label>
          <Select
            value={strategy.hedge_type}
            onValueChange={(value: HedgeType) => onStrategyChange({ 
              hedge_type: value,
              hedge_position: value === HedgeType.NONE ? null : strategy.hedge_position,
              hedge_leverage: value === HedgeType.NONE ? null : strategy.hedge_leverage,
              hedge_enabled: value === HedgeType.NONE ? false : strategy.hedge_enabled
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择对冲类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={HedgeType.NONE}>无</SelectItem>
              <SelectItem value={HedgeType.SPOT_FUTURES}>现货-合约</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hedge_position">对冲持仓方向</Label>
          <Select
            value={strategy.hedge_position ?? ''}
            onValueChange={(value: HedgePosition) => onStrategyChange({ hedge_position: value })}
            disabled={strategy.hedge_type === HedgeType.NONE}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择对冲持仓方向" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={HedgePosition.LONG}>做多</SelectItem>
              <SelectItem value={HedgePosition.SHORT}>做空</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hedge_leverage">对冲杠杆倍数</Label>
          <Input 
            id="hedge_leverage" 
            type="number"
            value={strategy.hedge_leverage ?? ''} 
            onChange={(e) => onStrategyChange({ hedge_leverage: parseFloat(e.target.value) })}
            placeholder="例如: 3" 
            disabled={strategy.hedge_type === HedgeType.NONE}
          />
        </div>
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox 
            id="hedge_enabled" 
            checked={strategy.hedge_enabled} 
            onCheckedChange={(checked) => onStrategyChange({ hedge_enabled: !!checked })}
            disabled={strategy.hedge_type === HedgeType.NONE}
          />
          <Label htmlFor="hedge_enabled">启用对冲</Label>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="bidirectional" 
            checked={strategy.bidirectional} 
            onCheckedChange={(checked) => onStrategyChange({ bidirectional: !!checked })}
          />
          <Label htmlFor="bidirectional">双向添加</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="futures_enabled" 
            checked={strategy.futures_enabled} 
            onCheckedChange={(checked) => onStrategyChange({ futures_enabled: !!checked })}
          />
          <Label htmlFor="futures_enabled">启用合约交易</Label>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="one_to_one_hedge" 
            checked={strategy.one_to_one_hedge} 
            onCheckedChange={(checked) => onStrategyChange({ one_to_one_hedge: !!checked })}
            disabled={!strategy.hedge_enabled}
          />
          <Label htmlFor="one_to_one_hedge">1:1对冲策略</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="close_position_together" 
            checked={strategy.close_position_together} 
            onCheckedChange={(checked) => onStrategyChange({ close_position_together: !!checked })}
          />
          <Label htmlFor="close_position_together">同时平仓现货和合约</Label>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="batch_buying" 
            checked={strategy.batch_buying} 
            onCheckedChange={(checked) => onStrategyChange({ 
              batch_buying: !!checked,
              batch_count: !checked ? null : strategy.batch_count,
              batch_interval: !checked ? null : strategy.batch_interval
            })}
          />
          <Label htmlFor="batch_buying">启用分批购买</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="batch_count">分批数量</Label>
          <Input 
            id="batch_count" 
            type="number"
            value={strategy.batch_count ?? ''} 
            onChange={(e) => onStrategyChange({ batch_count: parseInt(e.target.value) })}
            placeholder="例如: 3" 
            disabled={!strategy.batch_buying}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="batch_interval">分批间隔(秒)</Label>
          <Input 
            id="batch_interval" 
            type="number"
            value={strategy.batch_interval ?? ''} 
            onChange={(e) => onStrategyChange({ batch_interval: parseInt(e.target.value) })}
            placeholder="例如: 60" 
            disabled={!strategy.batch_buying}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="enabled" 
          checked={strategy.enabled} 
          onCheckedChange={(checked) => onStrategyChange({ enabled: !!checked })}
        />
        <Label htmlFor="enabled">启用策略</Label>
      </div>
    </div>
  );
}
