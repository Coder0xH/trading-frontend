'use client';

import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * 确认对话框组件属性
 */
interface ConfirmDialogProps {
  /**
   * 对话框是否打开
   */
  readonly open: boolean;
  
  /**
   * 关闭对话框的回调
   */
  readonly onOpenChange: (open: boolean) => void;
  
  /**
   * 确认按钮点击回调
   */
  readonly onConfirm: () => void;
  
  /**
   * 对话框标题
   */
  readonly title: string;
  
  /**
   * 对话框描述
   */
  readonly description: string;
  
  /**
   * 确认按钮文本
   */
  readonly confirmText?: string;
  
  /**
   * 取消按钮文本
   */
  readonly cancelText?: string;
  
  /**
   * 确认按钮变体
   */
  readonly confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  
  /**
   * 对话框内容
   */
  readonly children?: ReactNode;
}

/**
 * 确认对话框组件
 * 用于需要用户确认的操作
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  confirmVariant = 'default',
  children
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {children}
        
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={confirmVariant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
