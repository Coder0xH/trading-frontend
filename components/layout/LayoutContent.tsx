"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";

/**
 * 布局内容组件
 * 用于根据路径判断是否显示Header
 * 必须是客户端组件，因为使用了usePathname钩子
 */
export function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // 检查是否为认证页面
  const isAuthPage = pathname?.startsWith('/auth');
  
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* 只在非认证页面显示Header */}
      {!isAuthPage && <Header />}
      
      {/* 根据是否有Header调整内边距 */}
      <main className={cn(
        "flex-1",
        !isAuthPage ? "p-6 pt-20 md:p-8 md:pt-20" : ""
      )}>
        {children}
      </main>
      
      <Toaster />
    </div>
  );
}
