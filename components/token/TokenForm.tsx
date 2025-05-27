'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TokenFormBasicInfo } from './TokenFormBasicInfo';
import { TokenFormPermissions } from './TokenFormPermissions';
import { ContractAddressInput } from './ContractAddressInput';
import { TokenCreateParams, TokenUpdateParams, BinanceTokenResponse } from '@/types/token';

/**
 * 合约地址类型定义
 */
type ContractAddress = {
  network: string;
  address: string;
};

/**
 * 创建代币表单验证模式
 */
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
  contract_addresses: z.record(z.string(), z.string()).default({}),
});

/**
 * 更新代币表单验证模式
 */
const updateTokenSchema = z.object({
  coin: z.string().optional(), // 编辑时coin字段可选
  name: z.string().optional(),
  exchange: z.string().default('binance'),
  is_legal_money: z.boolean().default(false),
  trading: z.boolean().default(true),
  deposit_all_enable: z.boolean().default(true),
  withdraw_all_enable: z.boolean().default(true),
  usdt_trading_pair: z.string().optional(),
  has_contract_address: z.boolean().default(false),
  contract_addresses: z.record(z.string(), z.string()).default({}),
});

/**
 * 创建代币表单值类型
 */
type CreateTokenFormValues = z.infer<typeof createTokenSchema>;

/**
 * 更新代币表单值类型
 */
type UpdateTokenFormValues = z.infer<typeof updateTokenSchema>;

/**
 * 通用表单值类型 - 包含所有可能的字段
 */
type TokenFormValues = {
  coin?: string;
  name?: string;
  exchange: string;
  is_legal_money: boolean;
  trading: boolean;
  deposit_all_enable: boolean;
  withdraw_all_enable: boolean;
  usdt_trading_pair?: string;
  has_contract_address: boolean;
  contract_addresses: Record<string, string>;
};

/**
 * 代币表单基础属性接口
 */
interface BaseTokenFormProps {
  onCancel: () => void;
}

/**
 * 创建代币表单属性接口
 */
interface CreateTokenFormProps extends BaseTokenFormProps {
  isEditMode: false;
  onSubmit: (data: TokenCreateParams) => Promise<void>;
}

/**
 * 更新代币表单属性接口
 */
interface UpdateTokenFormProps extends BaseTokenFormProps {
  isEditMode: true;
  token: BinanceTokenResponse;
  onSubmit: (data: TokenUpdateParams) => Promise<void>;
}

/**
 * 代币表单组件
 * @param props 组件属性
 * @returns 代币表单组件
 */
export function TokenForm(props: CreateTokenFormProps | UpdateTokenFormProps) {
  const { isEditMode } = props;
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [contractAddresses, setContractAddresses] = useState<ContractAddress[]>([]);
  
  // 创建模式的表单
  const createForm = useForm<CreateTokenFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      contract_addresses: {},
    },
  });

  // 编辑模式的表单
  const updateForm = useForm<UpdateTokenFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      contract_addresses: {},
    },
  });

  // 初始化表单数据
  useEffect(() => {
    if (isEditMode && (props as UpdateTokenFormProps).token) {
      const token = (props as UpdateTokenFormProps).token;
      updateForm.reset({
        name: token.name || '',
        exchange: token.exchange || 'binance',
        is_legal_money: token.is_legal_money || false,
        trading: token.trading || true,
        deposit_all_enable: token.deposit_all_enable || true,
        withdraw_all_enable: token.withdraw_all_enable || true,
        usdt_trading_pair: token.usdt_trading_pair || '',
        has_contract_address: token.has_contract_address || false,
        contract_addresses: (token.contract_addresses || {}),
      });
      
      // 初始化合约地址 - 将Record<string, string>转换为ContractAddress[]
      if (token.contract_addresses && typeof token.contract_addresses === 'object') {
        const addressArray = Object.entries(token.contract_addresses).map(([network, address]) => ({
          network,
          address
        }));
        setContractAddresses(addressArray);
      }
    }
  }, [isEditMode, props, updateForm]);

  /**
   * 处理合约地址变更
   * @param addresses 合约地址数组
   */
  const handleContractAddressesChange = (addresses: ContractAddress[]) => {
    setContractAddresses(addresses);
    // 将数组格式转换为Record<string, string>格式
    const contractAddressesRecord = addresses.reduce((acc, addr) => {
      acc[addr.network] = addr.address;
      return acc;
    }, {} as Record<string, string>);
    
    if (isEditMode) {
      updateForm.setValue('contract_addresses', contractAddressesRecord);
    } else {
      createForm.setValue('contract_addresses', contractAddressesRecord);
    }
  };

  /**
   * 处理创建表单提交
   * @param values 表单值
   */
  const handleCreateSubmit = async (values: TokenFormValues) => {
    // 将数组格式转换为Record<string, string>格式
    const contractAddressesRecord = contractAddresses.reduce((acc, addr) => {
      acc[addr.network] = addr.address;
      return acc;
    }, {} as Record<string, string>);
    
    const formData: TokenCreateParams = {
      coin: values.coin!,
      name: values.name,
      exchange: values.exchange,
      is_legal_money: values.is_legal_money,
      trading: values.trading,
      deposit_all_enable: values.deposit_all_enable,
      withdraw_all_enable: values.withdraw_all_enable,
      usdt_trading_pair: values.usdt_trading_pair,
      has_contract_address: values.has_contract_address,
      contract_addresses: contractAddressesRecord,
    };
    
    await (props as CreateTokenFormProps).onSubmit(formData);
  };

  /**
   * 处理更新表单提交
   * @param values 表单值
   */
  const handleUpdateSubmit = async (values: TokenFormValues) => {
    // 将数组格式转换为Record<string, string>格式
    const contractAddressesRecord = contractAddresses.reduce((acc, addr) => {
      acc[addr.network] = addr.address;
      return acc;
    }, {} as Record<string, string>);
    
    const formData: TokenUpdateParams = {
      coin: values.coin!,
      name: values.name,
      exchange: values.exchange,
      is_legal_money: values.is_legal_money,
      trading: values.trading,
      deposit_all_enable: values.deposit_all_enable,
      withdraw_all_enable: values.withdraw_all_enable,
      usdt_trading_pair: values.usdt_trading_pair,
      has_contract_address: values.has_contract_address,
      contract_addresses: contractAddressesRecord,
    };
    
    await (props as UpdateTokenFormProps).onSubmit(formData);
  };

  // 当前使用的表单
  const form = isEditMode ? updateForm : createForm;

  // 监听合约地址复选框变化
  useEffect(() => {
    // 使用回调函数监听表单变化
    const subscription = form.watch((value) => {
      if (value && value.has_contract_address && activeTab !== 'contract') {
        setActiveTab('contract');
      }
    });
    
    // 清理函数
    return () => {
      // 安全地检查subscription是否有unsubscribe方法
      if (subscription && 'unsubscribe' in subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [activeTab, form]);

  // 创建表单提交处理函数
  const onSubmit = (data: CreateTokenFormValues | UpdateTokenFormValues) => {
    if (isEditMode) {
      return handleUpdateSubmit(data as UpdateTokenFormValues);
    } else {
      return handleCreateSubmit(data as CreateTokenFormValues);
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Form {...(form as any)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? '编辑代币' : '创建新代币'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="permissions">权限设置</TabsTrigger>
                <TabsTrigger value="contract">合约地址</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                <TokenFormBasicInfo 
                  form={form} 
                  isEditMode={isEditMode} 
                />
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4 pt-4">
                <TokenFormPermissions 
                  form={form} 
                />
              </TabsContent>
              
              <TabsContent value="contract" className="space-y-4 pt-4">
                {form.getValues()?.has_contract_address && (
                  <ContractAddressInput 
                    addresses={contractAddresses}
                    onChange={handleContractAddressesChange}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            取消
          </Button>
          <Button type="submit">
            {isEditMode ? '保存更改' : '创建代币'}
          </Button>
        </div>
      </form>
    </Form>
  );
}