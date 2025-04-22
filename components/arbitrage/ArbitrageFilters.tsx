'use client';

import { useState } from 'react';
import { 
  Slider 
} from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FilterIcon, 
  XIcon,
  PercentIcon,
  CoinsIcon,
  BarChart3Icon
} from 'lucide-react';

/**
 * 套利过滤器组件
 * 提供多种筛选条件以过滤套利机会
 */
export function ArbitrageFilters() {
  // 价差百分比范围
  const [priceDiffRange, setPriceDiffRange] = useState<[number, number]>([0.5, 5]);
  
  // 池子大小最小值（百万美元）
  const [minPoolSize, setMinPoolSize] = useState<number>(1);
  
  // 24小时交易量最小值（百万美元）
  const [minVolume, setMinVolume] = useState<number>(0.5);
  
  // 只显示可充提的币种
  const [onlyWithdrawableDepositable, setOnlyWithdrawableDepositable] = useState<boolean>(false);
  
  // 重置所有筛选条件
  const resetFilters = () => {
    setPriceDiffRange([0.5, 5]);
    setMinPoolSize(1);
    setMinVolume(0.5);
    setOnlyWithdrawableDepositable(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 价差百分比筛选 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <PercentIcon className="h-4 w-4 text-muted-foreground" />
              价差百分比范围
            </label>
            <span className="text-sm text-muted-foreground">
              {priceDiffRange[0].toFixed(1)}% - {priceDiffRange[1].toFixed(1)}%
            </span>
          </div>
          <Slider
            defaultValue={[0.5, 5]}
            max={10}
            min={0}
            step={0.1}
            value={priceDiffRange}
            onValueChange={(value) => setPriceDiffRange(value as [number, number])}
            className="py-2"
          />
        </div>

        {/* 池子大小筛选 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <CoinsIcon className="h-4 w-4 text-muted-foreground" />
              最小池子大小
            </label>
            <span className="text-sm text-muted-foreground">
              {minPoolSize}M USD
            </span>
          </div>
          <Slider
            defaultValue={[1]}
            max={10}
            min={0.1}
            step={0.1}
            value={[minPoolSize]}
            onValueChange={(value) => setMinPoolSize(value[0])}
            className="py-2"
          />
        </div>

        {/* 交易量筛选 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              最小24h交易量
            </label>
            <span className="text-sm text-muted-foreground">
              {minVolume}M USD
            </span>
          </div>
          <Slider
            defaultValue={[0.5]}
            max={5}
            min={0.1}
            step={0.1}
            value={[minVolume]}
            onValueChange={(value) => setMinVolume(value[0])}
            className="py-2"
          />
        </div>

        {/* 额外筛选条件 */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="withdraw-deposit" 
              checked={onlyWithdrawableDepositable}
              onCheckedChange={(checked) => 
                setOnlyWithdrawableDepositable(checked === true)
              }
            />
            <label
              htmlFor="withdraw-deposit"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              仅显示可充提币种
            </label>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <XIcon className="mr-2 h-4 w-4" />
              重置筛选
            </Button>
            <Button size="sm">
              <FilterIcon className="mr-2 h-4 w-4" />
              应用筛选
            </Button>
          </div>
        </div>

        {/* 活动筛选条件标签 */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="flex items-center">
            <span className="mr-1">价差: &gt;0.5%</span>
            <button className="rounded-full hover:bg-muted p-0.5">
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
          <Badge variant="secondary" className="flex items-center">
            <span className="mr-1">池子: &gt;1M</span>
            <button className="rounded-full hover:bg-muted p-0.5">
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      </div>
    </div>
  );
}
