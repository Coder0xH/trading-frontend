/**
 * 代币相关类型定义
 * @author Dexter
 * @date 2025-05-27
 */

/**
 * 代币响应接口
 */
export interface BinanceTokenResponse {
  id: number;
  coin: string;
  name: string | null;
  is_legal_money: boolean;
  trading: boolean;
  deposit_all_enable: boolean;
  withdraw_all_enable: boolean;
  networks: string[] | null;
  contract_addresses: Record<string, string> | null;
  has_contract_address: boolean;
  usdt_trading_pair: string | null;
  exchange: string | null;
  created_at: string;
  updated_at: string;
  last_synced_at: string | null;
}

/**
 * 同步请求接口
 */
export interface SyncRequest {
  limit?: number;
  force_update?: boolean;
}

/**
 * 同步响应接口
 */
export interface SyncResponse {
  success: boolean;
  message: string;
  synced_count: number;
  tokens: BinanceTokenResponse[];
  elapsed_time: number;
}

/**
 * 同步状态响应接口
 */
export interface SyncStatusResponse {
  total_tokens: number;
  tokens_with_contract: number;
  last_synced_at: string | null;
  timestamp: number;
}

/**
 * 创建代币请求参数
 */
export interface TokenCreateParams {
  coin: string;
  name?: string;
  exchange?: string;
  is_legal_money?: boolean;
  trading?: boolean;
  free?: string;
  locked?: string;
  freeze?: string;
  deposit_all_enable?: boolean;
  withdraw_all_enable?: boolean;
  networks?: string[];
  contract_addresses?: Record<string, string>;
  has_contract_address?: boolean;
  usdt_trading_pair?: string;
}

/**
 * 更新代币请求参数
 */
export interface TokenUpdateParams {
  coin: string;
  name?: string;
  exchange?: string;
  is_legal_money?: boolean;
  trading?: boolean;
  deposit_all_enable?: boolean;
  withdraw_all_enable?: boolean;
  networks?: string[];
  contract_addresses?: Record<string, string>;
  has_contract_address?: boolean;
  usdt_trading_pair?: string;
  last_synced_at?: string;
}
