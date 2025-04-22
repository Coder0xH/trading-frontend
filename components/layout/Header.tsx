'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, TrendingUpIcon, BarChart3Icon, HistoryIcon, GaugeIcon, LayersIcon, Settings2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 应用程序顶部导航栏组件
 * 包含应用程序标题、主题切换和导航链接
 */
export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 确保组件只在客户端渲染后执行主题相关操作
  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  /**
   * 切换明暗主题
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  /**
   * 切换移动端菜单
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 导航项
  const navItems = useMemo(() => [
    {
      name: '套利机会',
      href: '/',
      icon: TrendingUpIcon,
    },
    {
      name: '套利策略',
      href: '/strategies',
      icon: BarChart3Icon,
    },
    {
      name: '交易记录',
      href: '/history',
      icon: HistoryIcon,
    },
    {
      name: '市场监控',
      href: '/monitor',
      icon: GaugeIcon,
    },
    {
      name: '多链资产',
      href: '/assets',
      icon: LayersIcon,
    },
    {
      name: '交易所设置',
      href: '/settings',
      icon: Settings2Icon,
    },
  ], []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <span className="font-bold text-lg">加密套利平台</span>
            </Link>
          </div>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:flex ml-8 space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-muted",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("mr-2 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex-1"></div>
          
          {/* 移动端菜单按钮 */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn("transition-transform duration-200", isMobileMenuOpen && "rotate-90")}
            >
              {isMobileMenuOpen ? (
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </Button>
          
          {/* 主题切换按钮 */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="切换主题" className="ml-2">
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
            <span className="sr-only">切换主题</span>
          </Button>
        </div>
        
        {/* 移动端导航菜单 */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 max-h-0 border-t border-border/50",
          isMobileMenuOpen && "max-h-[400px]"
        )}>
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-muted",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
