'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TokenFormBasicInfoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isEditMode: boolean;
}

/**
 * 代币基本信息表单组件
 */
export function TokenFormBasicInfo({ form, isEditMode }: TokenFormBasicInfoProps) {
  return (
    <div className="space-y-4">
      {!isEditMode && (
        <FormField
          control={form.control}
          name="coin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>代币符号</FormLabel>
              <FormControl>
                <Input placeholder="例如: BTC" {...field} />
              </FormControl>
              <FormDescription>
                代币的唯一标识符，通常是代币的缩写。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>代币名称</FormLabel>
            <FormControl>
              <Input placeholder="例如: Bitcoin" {...field} />
            </FormControl>
            <FormDescription>
              代币的完整名称。
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exchange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>交易所</FormLabel>
            <FormControl>
              <Input placeholder="例如: binance" {...field} />
            </FormControl>
            <FormDescription>
              代币所属的交易所。
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usdt_trading_pair"
        render={({ field }) => (
          <FormItem>
            <FormLabel>USDT交易对</FormLabel>
            <FormControl>
              <Input placeholder="例如: BTCUSDT" {...field} />
            </FormControl>
            <FormDescription>
              代币与USDT的交易对。
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
