'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

/**
 * 错误边界组件的属性接口
 */
interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode;
  /** 回退UI组件，如果未提供则使用默认UI */
  fallback?: ReactNode;
}

/**
 * 错误边界组件的状态接口
 */
interface ErrorBoundaryState {
  /** 是否发生错误 */
  hasError: boolean;
  /** 错误信息 */
  error: Error | null;
}

/**
 * 错误边界组件
 * 用于捕获子组件树中的 JavaScript 错误，记录错误并显示回退UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * 构造函数
   * 
   * @param props - 组件属性
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  /**
   * 从错误中派生状态
   * 
   * @param error - 捕获的错误
   * @returns 更新的状态
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true,
      error
    };
  }

  /**
   * 捕获到错误后的生命周期方法
   * 
   * @param error - 捕获的错误
   * @param errorInfo - 错误信息，包含组件堆栈
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 可以在这里将错误日志发送到服务端
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  /**
   * 重置错误状态
   */
  resetError = (): void => {
    this.setState({ 
      hasError: false,
      error: null
    });
  };

  /**
   * 渲染组件
   * 
   * @returns 渲染的组件
   */
  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义回退UI，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认回退UI
      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-red-200 bg-red-50 text-red-800 m-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">页面出现错误</h2>
          <p className="text-sm mb-4">抱歉，组件渲染时发生错误。</p>
          {this.state.error && (
            <div className="bg-white p-4 rounded mb-4 w-full overflow-auto max-h-32">
              <pre className="text-xs text-red-600">{this.state.error.toString()}</pre>
            </div>
          )}
          <Button onClick={this.resetError}>
            重试
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
