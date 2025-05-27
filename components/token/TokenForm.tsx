'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { BinanceTokenResponse, TokenCreateParams, TokenUpdateParams } from '@/types/token';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

// 创建代币表单验证模式
const createTokenSchema = z.object({
  coin: z.string().min(1, '代币符号不能为空'),
  name: z.string().optional(),
  exchange: z.string().default('binance'),
  is_legal_money: z.boolean().default(false),
  trading: z.boolean().default(true),
  deposit_all_enable: z.boolean().default(true),
  withdraw_all_enable: z.boolean().default(true),
  usdt_trading_pair: z.string().optional(),
  has_contract_address: z.boolean().default(false),
});

// 更新代币表单验证模式
const updateTokenSchema = z.object({
  name: z.string().optional(),
  exchange: z.string().default('binance'),
  is_legal_money: z.boolean().default(false),
  trading: z.boolean().default(true),
  deposit_all_enable: z.boolean().default(true),
  withdraw_all_enable: z.boolean().default(true),
  usdt_trading_pair: z.string().optional(),
  has_contract_address: z.boolean().default(false),
});

// 定义表单类型
type CreateTokenFormValues = z.infer<typeof createTokenSchema>;
type UpdateTokenFormValues = z.infer<typeof updateTokenSchema>;

// 代币表单属性接口
interface CreateTokenFormProps {
  token?: undefined;
  loading?: boolean;
  onSubmit: (data: TokenCreateParams) => Promise<void>;
  onCancel: () => void;
}

interface UpdateTokenFormProps {
  token: BinanceTokenResponse;
  loading?: boolean;
  onSubmit: (data: TokenUpdateParams) => Promise<void>;
  onCancel: () => void;
}

type TokenFormProps = CreateTokenFormProps | UpdateTokenFormProps;

type FormData = CreateTokenFormValues | UpdateTokenFormValues;

/**
 * 代币表单组件
 * 用于创建或更新代币
 */
export function TokenForm(props: TokenFormProps) {
  const { loading, onCancel } = props;
  const isEditMode = 'token' in props && props.token !== undefined;
  
  // 创建模式的表单
  const createForm = useForm({
    resolver: zodResolver(createTokenSchema) as any,
    defaultValues: {
      coin: '',
      name: '',
      exchange: 'binance',
      is_legal_money: false,
      trading: true,
      deposit_all_enable: true,
      withdraw_all_enable: true,
      usdt_trading_pair: '',
      has_contract_address: false,
    },
  });

  // 编辑模式的表单
  const updateForm = useForm({
    resolver: zodResolver(updateTokenSchema) as any,
    defaultValues: {
      name: '',
      exchange: 'binance',
      is_legal_money: false,
      trading: true,
      deposit_all_enable: true,
      withdraw_all_enable: true,
      usdt_trading_pair: '',
      has_contract_address: false,
    },
  });

  // 当编辑模式下token变化时，更新表单值
  useEffect(() => {
    if (isEditMode && 'token' in props && props.token) {
      const token = props.token;
      updateForm.reset({
        name: token.name || '',
        exchange: token.exchange || 'binance',
        is_legal_money: token.is_legal_money,
        trading: token.trading,
        deposit_all_enable: token.deposit_all_enable,
        withdraw_all_enable: token.withdraw_all_enable,
        usdt_trading_pair: token.usdt_trading_pair || '',
        has_contract_address: token.has_contract_address,
      });
    }
  }, [isEditMode, props, updateForm]);

  // 处理表单提交
  const handleCreateSubmit = async (values: any) => {
    if (!isEditMode) {
      const formData: TokenCreateParams = {
        coin: values.coin,
        name: values.name,
        exchange: values.exchange,
        is_legal_money: values.is_legal_money,
        trading: values.trading,
        deposit_all_enable: values.deposit_all_enable,
        withdraw_all_enable: values.withdraw_all_enable,
        usdt_trading_pair: values.usdt_trading_pair,
        has_contract_address: values.has_contract_address,
      };
      await (props as CreateTokenFormProps).onSubmit(formData);
    }
  };

  const handleUpdateSubmit = async (values: any) => {
    if (isEditMode && 'token' in props && props.token) {
      const updateData: TokenUpdateParams = {
        coin: props.token.coin,
        name: values.name,
        exchange: values.exchange,
        is_legal_money: values.is_legal_money,
        trading: values.trading,
        deposit_all_enable: values.deposit_all_enable,
        withdraw_all_enable: values.withdraw_all_enable,
        usdt_trading_pair: values.usdt_trading_pair,
        has_contract_address: values.has_contract_address,
      };
      await (props as UpdateTokenFormProps).onSubmit(updateData);
    }
  };

  // 渲染创建表单
  const renderCreateForm = () => (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-6">
        <FormField
          control={createForm.control}
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

        <FormField
          control={createForm.control}
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
          control={createForm.control}
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
          control={createForm.control}
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

        <div className="space-y-4">
          <FormField
            control={createForm.control}
            name="is_legal_money"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    法定货币
                  </FormLabel>
                  <FormDescription>
                    是否为法定货币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="trading"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    允许交易
                  </FormLabel>
                  <FormDescription>
                    是否允许交易该代币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="deposit_all_enable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    允许充值
                  </FormLabel>
                  <FormDescription>
                    是否允许充值该代币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="withdraw_all_enable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    允许提现
                  </FormLabel>
                  <FormDescription>
                    是否允许提现该代币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="has_contract_address"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    有合约地址
                  </FormLabel>
                  <FormDescription>
                    该代币是否有合约地址。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  );

  // 渲染更新表单
  const renderUpdateForm = () => (
    <Form {...updateForm}>
      <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-6">
        <FormField
          control={updateForm.control}
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
          control={updateForm.control}
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
          control={updateForm.control}
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

        <div className="space-y-4">
          <FormField
            control={updateForm.control}
            name="is_legal_money"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    法定货币
                  </FormLabel>
                  <FormDescription>
                    是否为法定货币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={updateForm.control}
            name="trading"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    允许交易
                  </FormLabel>
                  <FormDescription>
                    是否允许交易该代币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={updateForm.control}
            name="deposit_all_enable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    允许充值
                  </FormLabel>
                  <FormDescription>
                    是否允许充值该代币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={updateForm.control}
            name="withdraw_all_enable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    允许提现
                  </FormLabel>
                  <FormDescription>
                    是否允许提现该代币。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={updateForm.control}
            name="has_contract_address"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    有合约地址
                  </FormLabel>
                  <FormDescription>
                    该代币是否有合约地址。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );

  return isEditMode ? renderUpdateForm() : renderCreateForm();
}
