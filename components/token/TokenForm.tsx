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

/**
 * 合约地址类型定义
 */
type ContractAddress = {
  network: string;
  address: string;
};

/**
 * 创建代币参数类型
 */
type TokenCreateParams = {
  coin: string;
  name?: string;
  exchange: string;
  is_legal_money: boolean;
  trading: boolean;
  deposit_all_enable: boolean;
  withdraw_all_enable: boolean;
  usdt_trading_pair?: string;
  has_contract_address: boolean;
  contract_addresses: ContractAddress[];
};

/**
 * 更新代币参数类型
 */
type TokenUpdateParams = {
  name?: string;
  exchange: string;
  is_legal_money: boolean;
  trading: boolean;
  deposit_all_enable: boolean;
  withdraw_all_enable: boolean;
  usdt_trading_pair?: string;
  has_contract_address: boolean;
  contract_addresses: ContractAddress[];
};

/**
 * 币安代币响应类型
 */
type BinanceTokenResponse = {
  coin?: string;
  name?: string;
  exchange?: string;
  is_legal_money?: boolean;
  trading?: boolean;
  deposit_all_enable?: boolean;
  withdraw_all_enable?: boolean;
  usdt_trading_pair?: string;
  has_contract_address?: boolean;
  contract_addresses?: ContractAddress[];
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
  contract_addresses: z.array(z.object({
    network: z.string(),
    address: z.string()
  })).default([]),
});

/**
 * 更新代币表单验证模式
 */
const updateTokenSchema = z.object({
  name: z.string().optional(),
  exchange: z.string().default('binance'),
  is_legal_money: z.boolean().default(false),
  trading: z.boolean().default(true),
  deposit_all_enable: z.boolean().default(true),
  withdraw_all_enable: z.boolean().default(true),
  usdt_trading_pair: z.string().optional(),
  has_contract_address: z.boolean().default(false),
  contract_addresses: z.array(z.object({
    network: z.string(),
    address: z.string()
  })).default([]),
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
      contract_addresses: [],
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
      contract_addresses: [],
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
        contract_addresses: (token.contract_addresses || []) as any,
      });
      
      // 初始化合约地址
      if (token.contract_addresses && token.contract_addresses.length > 0) {
        setContractAddresses(token.contract_addresses);
      }
    }
  }, [isEditMode, props, updateForm]);

  /**
   * 处理合约地址变更
   * @param addresses 合约地址数组
   */
  const handleContractAddressesChange = (addresses: ContractAddress[]) => {
    setContractAddresses(addresses);
    if (isEditMode) {
      updateForm.setValue('contract_addresses', addresses as any);
    } else {
      createForm.setValue('contract_addresses', addresses as any);
    }
  };

  /**
   * 处理创建表单提交
   * @param values 表单值
   */
  const handleCreateSubmit = async (values: CreateTokenFormValues) => {
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
      contract_addresses: values.has_contract_address ? contractAddresses : [],
    };
    if (!isEditMode) {
      await (props as CreateTokenFormProps).onSubmit(formData);
    }
  };

  /**
   * 处理更新表单提交
   * @param values 表单值
   */
  const handleUpdateSubmit = async (values: UpdateTokenFormValues) => {
    const formData: TokenUpdateParams = {
      name: values.name,
      exchange: values.exchange,
      is_legal_money: values.is_legal_money,
      trading: values.trading,
      deposit_all_enable: values.deposit_all_enable,
      withdraw_all_enable: values.withdraw_all_enable,
      usdt_trading_pair: values.usdt_trading_pair,
      has_contract_address: values.has_contract_address,
      contract_addresses: values.has_contract_address ? contractAddresses : [],
    };
    if (isEditMode) {
      await (props as UpdateTokenFormProps).onSubmit(formData);
    }
  };

  // 当前使用的表单
  const form = isEditMode ? updateForm : createForm;

  // 监听合约地址复选框变化
  useEffect(() => {
    // 使用回调函数监听表单变化
    const subscription = form.watch((value: any) => {
      if (value && value.has_contract_address && activeTab !== 'contract') {
        setActiveTab('contract');
      }
    });
    
    // 清理函数
    return () => {
      // 安全地检查subscription是否有unsubscribe方法
      if (subscription && typeof (subscription as any).unsubscribe === 'function') {
        (subscription as any).unsubscribe();
      }
    };
  }, [activeTab, form]);

  // 创建表单提交处理函数
  const onSubmit = (data: any) => {
    if (isEditMode) {
      return handleUpdateSubmit(data as UpdateTokenFormValues);
    } else {
      return handleCreateSubmit(data as CreateTokenFormValues);
    }
  };

  return (
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
                <TabsTrigger 
                  value="contract" 
                  disabled={!form.getValues()?.has_contract_address}
                >
                  合约地址
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                {/* 使用as any强制类型转换，解决不同表单类型之间的兼容性问题 */}
                <TokenFormBasicInfo 
                  form={form as any} 
                  isEditMode={isEditMode} 
                />
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4 pt-4">
                {/* 使用as any强制类型转换，解决不同表单类型之间的兼容性问题 */}
                <TokenFormPermissions 
                  form={form as any} 
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