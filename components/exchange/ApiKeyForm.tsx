'use client';

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
import { ApiKeyResponse } from '@/types/apiKey';
import { ExchangeResponse, CreateExchangeApiKeyParams } from '@/types/exchange';
import { useApiKeyForm } from '@/hooks/useApiKeyForm';

/**
 * API密钥表单组件属性接口
 */
interface ApiKeyFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (apiKey: CreateExchangeApiKeyParams) => Promise<void>;
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
  // 使用自定义hook管理表单状态
  const {
    formValues,
    updateField,
    error,
    setError,
    formTitle,
    formDescription,
    validateForm,
    isEditing
  } = useApiKeyForm(editingApiKey, initialExchangeId, exchanges);
  
  /**
   * 处理表单提交
   */
  const handleSubmit = async () => {
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    try {
      // 如果是编辑模式，且没有填写API Key和Secret，则只更新标签和是否默认
      if (isEditing) {
        const updateData: Partial<CreateExchangeApiKeyParams> = {
          label: formValues.label,
          is_default: formValues.is_default
        };
        
        // 只有当填写了这些字段时才更新
        if (formValues.api_key) updateData.api_key = formValues.api_key;
        if (formValues.api_secret) updateData.api_secret = formValues.api_secret;
        if (formValues.passphrase) updateData.passphrase = formValues.passphrase;
        
        await onSubmit(updateData as CreateExchangeApiKeyParams);
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
            {formDescription}
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
                onValueChange={(value) => updateField('exchange_id', parseInt(value))}
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
              onChange={(e) => updateField('label', e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              用于区分不同的API密钥，如&quot;主账户&quot;、&quot;子账户1&quot;等
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key" className={!editingApiKey ? "text-red-500" : ""}>
              {!editingApiKey ? "* " : ""}API Key:
            </Label>
            <Input 
              id="api-key" 
              placeholder={isEditing ? "留空则不修改" : "输入API Key"} 
              value={formValues.api_key}
              onChange={(e) => updateField('api_key', e.target.value)}
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
              placeholder={isEditing ? "留空则不修改" : "输入API Secret"} 
              value={formValues.api_secret}
              onChange={(e) => updateField('api_secret', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passphrase">Passphrase:</Label>
            <Input 
              id="passphrase" 
              type="password"
              placeholder={isEditing ? "留空则不修改" : "输入密码短语（如有）"} 
              value={formValues.passphrase ?? ''}
              onChange={(e) => updateField('passphrase', e.target.value)}
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
              onCheckedChange={(checked) => updateField('is_default', checked)}
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
            disabled={isLoading || (!isEditing && (!formValues.exchange_id || !formValues.label || !formValues.api_key || !formValues.api_secret))}
          >
            {isLoading ? '处理中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
