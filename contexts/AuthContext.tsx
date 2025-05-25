/**
 * 认证上下文
 * 提供用户认证状态和相关方法
 * @author Dexter
 * @date 2025-05-25
 */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/user";
import { authApi } from "@/api/auth";

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<any>;
  verifyTotp: (username: string, totpCode: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<any>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者属性
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证提供者组件
 * @param children 子组件
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getCurrentUser();
      setUser(response.data);
      return response;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 登录方法
  const login = async (username: string, password: string, totpCode?: string) => {
    try {
      const response = await authApi.login(username, password, totpCode);
      
      // 如果不需要TOTP验证，获取用户信息
      if (!response.data.requires_totp) {
        await refreshUser();
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // TOTP验证方法
  const verifyTotp = async (username: string, totpCode: string) => {
    try {
      const response = await authApi.verifyTotp(username, totpCode);
      await refreshUser();
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error("登出失败", error);
    }
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    refreshUser();
  }, []);

  // 提供上下文值
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verifyTotp,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 使用认证上下文的钩子
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth必须在AuthProvider内部使用");
  }
  
  return context;
}
