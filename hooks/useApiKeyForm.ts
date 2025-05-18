/**
 * API密钥表单自定义Hook
 * @author Dexter
 * @date 2025-05-18
 */

import { useState, useEffect, useMemo } from 'react';
import { CreateExchangeApiKeyParams } from '@/types/exchange';
import { ApiKeyResponse } from '@/types/apiKey';

/**
 * 获取API密钥表单初始值
 * @param editingApiKey 正在编辑的API密钥
 * @param initialExchangeId 初始交易所ID
 * @param exchanges 交易所列表
 * @returns API密钥表单初始值
 */
export const getInitialFormValues = (
  editingApiKey: ApiKeyResponse | null,
  initialExchangeId: number | undefined,
  exchanges: { id: number }[]
): CreateExchangeApiKeyParams => {
  if (editingApiKey) {
    return {
      exchange_id: editingApiKey.exchange_id,
      label: editingApiKey.label,
      api_key: '', // 不回显敏感信息
      api_secret: '',
      passphrase: '',
      is_default: editingApiKey.is_default,
      is_testnet: false,
      can_trade: true,
      can_withdraw: false
    };
  } else if (initialExchangeId) {
    return {
      exchange_id: initialExchangeId,
      label: '',
      api_key: '',
      api_secret: '',
      passphrase: '',
      is_default: false,
      is_testnet: false,
      can_trade: true,
      can_withdraw: false
    };
  } else {
    // 默认表单值
    return {
      exchange_id: exchanges.length > 0 ? exchanges[0].id : 0,
      label: '',
      api_key: '',
      api_secret: '',
      passphrase: '',
      is_default: false,
      is_testnet: false,
      can_trade: true,
      can_withdraw: false
    };
  }
};

/**
 * API密钥表单Hook
 * @param editingApiKey 正在编辑的API密钥
 * @param initialExchangeId 初始交易所ID
 * @param exchanges 交易所列表
 * @returns 表单状态和方法
 */
export function useApiKeyForm(
  editingApiKey: ApiKeyResponse | null = null,
  initialExchangeId?: number,
  exchanges: { id: number }[] = []
) {
  // 表单状态
  const [formValues, setFormValues] = useState<CreateExchangeApiKeyParams>(() => 
    getInitialFormValues(editingApiKey, initialExchangeId, exchanges)
  );
  
  // 错误状态
  const [error, setError] = useState<string | null>(null);
  
  // 当依赖项变化时重置表单
  useEffect(() => {
    setFormValues(getInitialFormValues(editingApiKey, initialExchangeId, exchanges));
  }, [editingApiKey, initialExchangeId, exchanges]);
  
  // 表单标题
  const formTitle = useMemo(() => editingApiKey ? '编辑API密钥' : '添加API密钥', [editingApiKey]);
  
  // 表单描述
  const formDescription = useMemo(() => 
    editingApiKey 
      ? '修改API密钥信息，如不需修改密钥可留空' 
      : '添加新的API密钥，所有带*的字段为必填',
    [editingApiKey]
  );
  
  /**
   * 更新表单字段值
   * @param field 字段名
   * @param value 字段值
   */
  const updateField = (field: keyof CreateExchangeApiKeyParams, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  /**
   * 验证表单
   * @returns 是否验证通过
   */
  const validateForm = (): boolean => {
    if (!formValues.exchange_id) {
      setError('请选择交易所');
      return false;
    }
    
    if (!formValues.label) {
      setError('请输入标签');
      return false;
    }
    
    // 如果是新建API密钥，则验证API Key和Secret
    if (!editingApiKey && (!formValues.api_key || !formValues.api_secret)) {
      setError('请输入API Key和Secret');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  return {
    formValues,
    setFormValues,
    updateField,
    error,
    setError,
    formTitle,
    formDescription,
    validateForm,
    isEditing: !!editingApiKey
  };
}

export default useApiKeyForm;
