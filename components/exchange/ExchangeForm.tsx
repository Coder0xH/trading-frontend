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
  ExchangeCreate, 
  ExchangeType
} from '@/types/exchange';

/**
 * 交易所表单组件属性接口
 */
interface ExchangeFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (exchange: ExchangeCreate) => Promise<void>;
  readonly editingExchange?: ExchangeResponse | null;
  readonly isLoading?: boolean;
}

/**
 * 交易所表单组件
 * 用于添加和编辑交易所
 */
export function ExchangeForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingExchange = null,
  isLoading = false
}: ExchangeFormProps) {
  // 表单状态
  const [formValues, setFormValues] = useState<ExchangeCreate>({
    name: '',
    display_name: '',
    exchange_type: ExchangeType.SPOT,
    is_active: true
  });
  
  // 错误状态
  const [error, setError] = useState<string | null>(null);
  
  // 表单标题
  const formTitle = editingExchange ? '编辑交易所' : '添加交易所';
  
  // 当编辑的交易所改变时，更新表单值
  useEffect(() => {
    if (editingExchange) {
      setFormValues({
        name: editingExchange.name,
        display_name: editingExchange.display_name,
        exchange_type: editingExchange.exchange_type,
        is_active: editingExchange.is_active
      });
    } else {
      // 重置表单
      setFormValues({
        name: '',
        display_name: '',
        exchange_type: ExchangeType.SPOT,
        is_active: true
      });
    }
  }, [editingExchange]);
  
  /**
   * 处理表单提交
   */
  const handleSubmit = async () => {
    // 验证表单
    if (!formValues.name) {
      setError('请输入交易所标识');
      return;
    }
    
    if (!formValues.display_name) {
      setError('请输入显示名称');
      return;
    }
    
    setError(null);
    
    try {
      await onSubmit(formValues);
      
      // 关闭对话框
      onClose();
    } catch (err) {
      console.error('提交交易所失败:', err);
      setError('提交失败，请稍后重试');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>
            {editingExchange 
              ? '修改交易所信息，点击保存应用更改' 
              : '添加新的交易所，所有带*的字段为必填'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exchange-name" className="text-red-500">* 交易平台标识:</Label>
            <Input 
              id="exchange-name" 
              placeholder="输入交易所标识，如 binance, okx" 
              value={formValues.name}
              onChange={(e) => setFormValues({...formValues, name: e.target.value})}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              交易所的唯一标识符，通常为小写字母，如 binance, okx 等
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-red-500">* 显示名称:</Label>
            <Input 
              id="display-name" 
              placeholder="输入交易所显示名称，如 币安, OKX" 
              value={formValues.display_name}
              onChange={(e) => setFormValues({...formValues, display_name: e.target.value})}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              交易所的显示名称，用于在界面上展示
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exchange-type" className="text-red-500">* 交易所类型:</Label>
            <Select 
              value={formValues.exchange_type}
              onValueChange={(value) => setFormValues({...formValues, exchange_type: value as ExchangeType})}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择交易所类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ExchangeType.SPOT}>现货</SelectItem>
                <SelectItem value={ExchangeType.FUTURES}>合约</SelectItem>
                <SelectItem value={ExchangeType.BOTH}>现货和合约</SelectItem>
                <SelectItem value={ExchangeType.DEX}>DEX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is-active" 
              checked={formValues.is_active}
              onCheckedChange={(checked) => setFormValues({...formValues, is_active: checked})}
              disabled={isLoading}
            />
            <Label htmlFor="is-active">启用</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !formValues.name || !formValues.display_name}
          >
            {isLoading ? '处理中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
