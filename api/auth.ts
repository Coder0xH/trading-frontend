/**
 * 认证API服务
 * 整合所有认证相关的API调用
 * @author Dexter
 * @date 2025-05-25
 */
import { request, ApiResponse } from '@/lib/request';
import { User } from '@/types/user';

// 定义登录响应类型
export interface LoginResponse {
  token_type: string;
  requires_totp: boolean;
  expires_in: number;
}

// 定义TOTP设置响应类型
export interface TOTPSetupResponse {
  secret: string;
  uri: string;
}

/**
 * 认证API服务
 */
export const authApi = {
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns 登录结果
   */
  login: async (username: string, password: string, totpCode?: string) => {
    return request.post<LoginResponse>('/auth/login', { username, password, totp_code: totpCode });
  },

  /**
   * TOTP验证登录
   * @param username 用户名
   * @param totpCode TOTP验证码
   * @returns 登录结果
   */
  verifyTotp: async (username: string, totpCode: string) => {
    return request.post<LoginResponse>('/auth/login/totp', { username, totp_code: totpCode });
  },

  /**
   * 获取当前用户信息
   * @returns 当前用户信息
   */
  getCurrentUser: async () => {
    return request.get<User>('/auth/me');
  },

  /**
   * 用户登出
   * @returns 登出结果
   */
  logout: async () => {
    return request.post<ApiResponse<null>>('/auth/logout', {});
  },

  /**
   * 设置TOTP两步验证
   * @returns TOTP设置信息
   */
  setupTotp: async () => {
    return request.post<TOTPSetupResponse>('/auth/totp/setup', {});
  },

  /**
   * 验证并启用TOTP两步验证
   * @param totp_code TOTP验证码
   * @returns 启用结果
   */
  enableTotp: async (totp_code: string) => {
    return request.post<ApiResponse<null>>('/auth/totp/verify', { totp_code });
  },

  /**
   * 禁用TOTP两步验证
   * @returns 禁用结果
   */
  disableTotp: async () => {
    return request.post<ApiResponse<null>>('/auth/totp/disable', {});
  },
};

export default authApi;
