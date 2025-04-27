'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ExchangeResponse, 
  ApiKeyResponse, 
  ApiKeyCreate
} from '@/services/exchangeApi';

/**
 * API密钥表单组件属性接口
 */
interface ApiKeyFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (apiKey: ApiKeyCreate) => Promise<void>;
  readonly exchanges: ExchangeResponse[];
  readonly editingApiKey?: ApiKeyResponse | null;
  readonly initialExchangeId?: number;
  readonly isLoading?: boolean;
}

/**
 * API密钥表单组件
 * 用于添加和编辑API密钥
 */
export function ApiKeyForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  exchanges, 
  editingApiKey = null,
  initialExchangeId,
  isLoading = false
}: ApiKeyFormProps) {
  // 表单状态
  const [formValues, setFormValues] = useState<ApiKeyCreate>({
    exchange_id: initialExchangeId ?? 0,
    label: '',
    api_key: '',
    api_secret: '',
    passphrase: '',
    is_default: false
  });
  
  // 错误状态
  const [error, setError] = useState<string | null>(null);
  
  // 表单标题
  const formTitle = editingApiKey ? '编辑API密钥' : '添加API密钥';
  
  // 当编辑的API密钥改变时，更新表单值
  useEffect(() => {
    if (editingApiKey) {
      setFormValues({
        exchange_id: editingApiKey.exchange_id,
        label: editingApiKey.label,
        api_key: '', // 不回显敏感信息
        api_secret: '',
        passphrase: '',
        is_default: editingApiKey.is_default
      });
    } else if (initialExchangeId) {
      setFormValues({
        exchange_id: initialExchangeId,
        label: '',
        api_key: '',
        api_secret: '',
        passphrase: '',
        is_default: false
      });
    } else {
      // 重置表单
      setFormValues({
        exchange_id: exchanges.length > 0 ? exchanges[0].id : 0,
        label: '',
        api_key: '',
        api_secret: '',
        passphrase: '',
        is_default: false
      });
    }
  }, [editingApiKey, initialExchangeId, exchanges]);
  
  /**
   * 处理表单提交
   */
  const handleSubmit = async () => {
    // 验证表单
    if (!formValues.exchange_id) {
      setError('请选择交易所');
      return;
    }
    
    if (!formValues.label) {
      setError('请输入标签');
      return;
    }
    
    // 如果是新建API密钥，则验证API Key和Secret
    if (!editingApiKey && (!formValues.api_key || !formValues.api_secret)) {
      setError('请输入API Key和Secret');
      return;
    }
    
    setError(null);
    
    try {
      // 如果是编辑模式，且没有填写API Key和Secret，则只更新标签和是否默认
      if (editingApiKey) {
        const updateData: Partial<ApiKeyCreate> = {
          label: formValues.label,
          is_default: formValues.is_default
        };
        
        // 只有当填写了这些字段时才更新
        if (formValues.api_key) updateData.api_key = formValues.api_key;
        if (formValues.api_secret) updateData.api_secret = formValues.api_secret;
        if (formValues.passphrase) updateData.passphrase = formValues.passphrase;
        
        await onSubmit(updateData as ApiKeyCreate);
      } else {
        await onSubmit(formValues);
      }
      
      // 关闭对话框
      onClose();
    } catch (err) {
      console.error('提交API密钥失败:', err);
      setError('提交失败，请稍后重试');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>
            {editingApiKey 
              ? '修改API密钥信息，如不需修改密钥可留空' 
              : '添加新的API密钥，所有带*的字段为必填'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          {!editingApiKey && (
            <div className="space-y-2">
              <Label htmlFor="exchange-id" className="text-red-500">* 交易所:</Label>
              <Select 
                value={formValues.exchange_id.toString()}
                onValueChange={(value) => setFormValues({...formValues, exchange_id: parseInt(value)})}
                disabled={!!initialExchangeId || isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择交易所" />
                </SelectTrigger>
                <SelectContent>
                  {exchanges.map((exchange) => (
                    <SelectItem key={exchange.id} value={exchange.id.toString()}>
                      {exchange.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="api-label" className="text-red-500">* 标签:</Label>
            <Input 
              id="api-label" 
              placeholder="输入标签，如'主账户'" 
              value={formValues.label}
              onChange={(e) => setFormValues({...formValues, label: e.target.value})}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              用于区分不同的API密钥，如"主账户"、"子账户1"等
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key" className={!editingApiKey ? "text-red-500" : ""}>
              {!editingApiKey ? "* " : ""}API Key:
            </Label>
            <Input 
              id="api-key" 
              placeholder={editingApiKey ? "留空则不修改" : "输入API Key"} 
              value={formValues.api_key}
              onChange={(e) => setFormValues({...formValues, api_key: e.target.value})}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-secret" className={!editingApiKey ? "text-red-500" : ""}>
              {!editingApiKey ? "* " : ""}API Secret:
            </Label>
            <Input 
              id="api-secret" 
              type="password"
              placeholder={editingApiKey ? "留空则不修改" : "输入API Secret"} 
              value={formValues.api_secret}
              onChange={(e) => setFormValues({...formValues, api_secret: e.target.value})}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passphrase">Passphrase:</Label>
            <Input 
              id="passphrase" 
              type="password"
              placeholder={editingApiKey ? "留空则不修改" : "输入密码短语（如有）"} 
              value={formValues.passphrase}
              onChange={(e) => setFormValues({...formValues, passphrase: e.target.value})}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              部分交易所（如OKX）需要密码短语
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is-default" 
              checked={formValues.is_default}
              onCheckedChange={(checked) => setFormValues({...formValues, is_default: checked})}
              disabled={isLoading}
            />
            <Label htmlFor="is-default">设为默认</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || (!editingApiKey && (!formValues.exchange_id || !formValues.label || !formValues.api_key || !formValues.api_secret))}
          >
            {isLoading ? '处理中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
