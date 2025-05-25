/**
 * 用户相关类型定义
 * @author Dexter
 * @date 2025-05-25
 */

/**
 * 用户基本信息
 */
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  totp_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

/**
 * 用户创建参数
 */
export interface UserCreateParams {
  username: string;
  email: string;
  password: string;
}

/**
 * 用户更新参数
 */
export interface UserUpdateParams {
  email?: string;
  password?: string;
  is_active?: boolean;
}

/**
 * 登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * TOTP验证参数
 */
export interface TOTPVerifyParams {
  username: string;
  totp_code: string;
}
