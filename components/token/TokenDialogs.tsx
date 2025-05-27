'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { BinanceTokenResponse, TokenCreateParams, TokenUpdateParams } from '@/types/token';
import { TokenForm } from './TokenForm';

// 创建代币对话框属性接口
interface CreateTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TokenCreateParams) => Promise<void>;
}

/**
 * 创建代币对话框组件
 */
export function CreateTokenDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: CreateTokenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>创建新代币</DialogTitle>
          <DialogDescription>
            添加一个新的代币到系统中。请填写以下信息。
          </DialogDescription>
        </DialogHeader>
        <TokenForm 
          isEditMode={false}
          onSubmit={onSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}

// 编辑代币对话框属性接口
interface EditTokenDialogProps {
  token: BinanceTokenResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: number, data: TokenUpdateParams) => Promise<void>;
}

/**
 * 编辑代币对话框组件
 */
export function EditTokenDialog({ 
  token, 
  open, 
  onOpenChange, 
  onSubmit 
}: EditTokenDialogProps) {
  const handleSubmit = async (data: TokenUpdateParams) => {
    if (token) {
      await onSubmit(token.id, data);
    }
  };

  // 只在token存在时渲染TokenForm
  const renderContent = () => {
    if (!token) {
      return (
        <DialogHeader>
          <DialogTitle>加载代币信息中...</DialogTitle>
        </DialogHeader>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>编辑代币 {token.coin}</DialogTitle>
          <DialogDescription>
            修改代币的信息。请更新以下字段。
          </DialogDescription>
        </DialogHeader>
        <TokenForm 
          isEditMode={true}
          token={token} 
          onSubmit={handleSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

// 删除代币对话框属性接口
interface DeleteTokenDialogProps {
  token: BinanceTokenResponse | null;
  open: boolean;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: number) => Promise<void>;
}

/**
 * 删除代币对话框组件
 */
export function DeleteTokenDialog({ 
  token, 
  open, 
  loading, 
  onOpenChange, 
  onConfirm 
}: DeleteTokenDialogProps) {
  const handleConfirm = async () => {
    if (token) {
      await onConfirm(token.id);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除代币</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除代币 {token?.coin} 吗？此操作不可撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                删除中...
              </>
            ) : (
              '确认删除'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
