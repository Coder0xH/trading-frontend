'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArbitrageStrategyConfig } from '@/types/arbitrage';

interface BasicInfoSectionProps {
  strategy: ArbitrageStrategyConfig;
  onStrategyChange: (updatedStrategy: Partial<ArbitrageStrategyConfig>) => void;
}

/**
 * 基本信息组件
 */
export function BasicInfoSection({ 
  strategy, 
  onStrategyChange 
}: Readonly<BasicInfoSectionProps>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">策略名称</Label>
          <Input 
            id="name" 
            value={strategy.name} 
            onChange={(e) => onStrategyChange({ name: e.target.value })}
            placeholder="输入策略名称" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="symbol">交易对</Label>
          <Input 
            id="symbol" 
            value={strategy.symbol} 
            onChange={(e) => onStrategyChange({ symbol: e.target.value })}
            placeholder="例如: BTC/USDT" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chain_id">链ID</Label>
          <Select
            value={strategy.chain_id}
            onValueChange={(value) => onStrategyChange({ chain_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择链ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">以太坊 (ETH)</SelectItem>
              <SelectItem value="56">币安智能链 (BSC)</SelectItem>
              <SelectItem value="137">Polygon</SelectItem>
              <SelectItem value="42161">Arbitrum</SelectItem>
              <SelectItem value="10">Optimism</SelectItem>
              <SelectItem value="43114">Avalanche</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="token_address">代币地址 (可选)</Label>
          <Input 
            id="token_address" 
            value={strategy.token_address ?? ''} 
            onChange={(e) => onStrategyChange({ token_address: e.target.value })}
            placeholder="代币合约地址" 
          />
        </div>
      </div>
    </div>
  );
}
