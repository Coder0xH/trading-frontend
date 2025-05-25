'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, TrendingUpIcon, BarChart3Icon, HistoryIcon, Settings2Icon, LogOutIcon, ShieldIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TotpSetupDialog, TotpManageDialog } from "@/components/auth/TotpSetupDialog";
import { cn } from '@/lib/utils';

/**
 * 应用程序顶部导航栏组件
 * 包含应用程序标题、主题切换和导航链接
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  
  // TOTP对话框状态
  const [totpSetupOpen, setTotpSetupOpen] = useState(false);
  const [totpManageOpen, setTotpManageOpen] = useState(false);
  
  // 确保组件挂载后不重复请求用户信息
  useEffect(() => {
    // 仅在组件挂载后执行一次
    if (isMounted && !user) {
      // 如果用户信息为空，才请求用户信息
      const fetchUserData = async () => {
        try {
          await refreshUser();
        } catch (error) {
          console.error('获取用户信息失败', error);
          // 错误处理已在refreshUser中完成，这里不需要额外处理
        }
      };
      
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, user]);
  
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
      name: 'API Key',
      href: '/settings',
      icon: Settings2Icon,
    },
    {
      name: '代币管理',
      href: '/token',
      icon: Settings2Icon,
    },
  ], []);
  
  // 安全项
  const securityItems = useMemo(() => [
    {
      name: '两步验证',
      icon: ShieldIcon,
      action: () => {
        if (user?.totp_enabled) {
          setTotpManageOpen(true);
        } else {
          setTotpSetupOpen(true);
        }
        setIsMobileMenuOpen(false);
      },
      badge: user?.totp_enabled ? '已启用' : undefined,
      badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
  ], [user?.totp_enabled]);

  if (!isMounted) {
    return null;
  }

  return (
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
        
        {/* 用户信息下拉菜单 - 仅在用户已登录时显示 */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
                if (user?.totp_enabled) {
                  setTotpManageOpen(true);
                } else {
                  setTotpSetupOpen(true);
                }
              }}>
                <div className="flex items-center">
                  <ShieldIcon className="mr-2 h-4 w-4" />
                  <span>两步验证</span>
                  {user?.totp_enabled && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      已启用
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await logout();
                    toast({
                      title: "退出成功",
                      description: "您已成功退出登录",
                    });
                    // 退出后重定向到登录页面
                    router.push('/auth/login');
                  } catch (error) {
                    console.error("退出登录失败", error);
                    toast({
                      variant: "destructive",
                      title: "退出失败",
                      description: "退出登录时发生错误，请重试",
                    });
                  }
                }}
                className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
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
        isMobileMenuOpen && "max-h-[500px]"
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
        
        {/* 安全设置项 */}
        {user && (
          <div className="px-4 py-2 border-t border-border/50">
            <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">安全设置</h3>
            <div className="space-y-1">
              {securityItems.map((item, index) => {
                const Icon = item.icon;
                
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                    onClick={item.action}
                  >
                    <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className={cn("ml-auto px-1.5 py-0.5 text-xs rounded-full", item.badgeColor)}>
                        {item.badge}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* 移动端导航菜单底部空白区域 */}
        <div className="px-4 py-2"></div>
      </div>
      
      {/* TOTP设置对话框 */}
      <TotpSetupDialog 
        open={totpSetupOpen} 
        onOpenChange={setTotpSetupOpen} 
        onSetupComplete={() => {
          refreshUser();
        }} 
      />
      
      {/* TOTP管理对话框 */}
      <TotpManageDialog 
        open={totpManageOpen} 
        onOpenChange={setTotpManageOpen} 
        enabled={!!user?.totp_enabled} 
        onComplete={() => {
          setTotpSetupOpen(true);
          setTotpManageOpen(false);
        }} 
      />
    </header>
  );
}
