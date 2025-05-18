/**
 * 套利策略相关类型定义
 * @author Dexter
 * @date 2025-05-18
 */

/**
 * 池子大小枚举
 */
export enum PoolSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

/**
 * 套利策略配置接口
 */
export interface ArbitrageStrategyConfig {
  name: string;
  symbol: string;
  chain_id: string;
  token_address?: string;
  buy_exchange: string;
  sell_exchange: string;
  buy_exchange_api_key_id?: string;
  sell_exchange_api_key_id?: string;
  min_price_diff?: number;
  direction?: ArbitrageDirection;
  min_trade_amount: number;
  max_trade_amount: number;
  max_position: number;
  trade_mode?: TradeMode;
  hedge_type?: HedgeType;
  hedge_position?: HedgePosition | null;
  hedge_leverage?: number | null;
  hedge_enabled?: boolean;
  bidirectional?: boolean;
  open_price_diff: number;
  close_price_diff?: number | null;
  batch_buying?: boolean;
  batch_count?: number | null;
  batch_interval?: number | null;
  enabled?: boolean;
  futures_enabled?: boolean;
  pool_size?: PoolSize;
  one_to_one_hedge?: boolean;
  close_position_together?: boolean;
}

/**
 * 套利策略类型枚举
 */
export enum ArbitrageType {
  SPOT = 'spot',
  FUTURES = 'futures',
  CROSS_EXCHANGE = 'cross_exchange'
}

/**
 * 套利策略状态枚举
 */
export enum ArbitrageStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped'
}

/**
 * 套利方向枚举
 */
export enum ArbitrageDirection {
  CHAIN_TO_EXCHANGE = 'chain_to_exchange',
  EXCHANGE_TO_CHAIN = 'exchange_to_chain'
}

/**
 * 交易模式枚举
 */
export enum TradeMode {
  SPOT = 'spot',
  FUTURES = 'futures',
  BOTH = 'both'
}

/**
 * 对冲类型枚举
 */
export enum HedgeType {
  NONE = 'none',
  SPOT_FUTURES = 'spot_futures'
}

/**
 * 对冲持仓方向枚举
 */
export enum HedgePosition {
  LONG = 'long',
  SHORT = 'short'
}

/**
 * 套利策略基础接口
 */
export interface ArbitrageStrategy extends ArbitrageStrategyConfig {
  id: string;
  type: ArbitrageType;
  status: ArbitrageStatus;
  created_at: string;
  updated_at: string;
  last_execution?: string | null;
  total_executions?: number;
  total_profit?: number;
  success_rate?: number;
}

/**
 * 创建套利策略请求参数
 */
export interface CreateArbitrageParams {
  name: string;
  description?: string;
  type?: ArbitrageType;
  config?: Record<string, any>;
  // 允许使用ArbitrageStrategyConfig的其他属性
  [key: string]: any;
}

/**
 * 更新套利策略请求参数
 */
export interface UpdateArbitrageParams {
  name?: string;
  description?: string;
  status?: ArbitrageStatus;
  config?: Record<string, any>;
}

/**
 * 套利策略执行结果
 */
export interface ArbitrageExecutionResult {
  strategy_id: string;
  execution_id: string;
  status: 'success' | 'failed';
  message?: string;
  details?: Record<string, any>;
  executed_at: string;
}

/**
 * 套利机会接口
 */
export interface ArbitrageOpportunity {
  id: string;
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  priceDifference: number;
  priceDifferencePercentage: number;
  volume24h: number;
  poolSize: number;
  chain: string;
  withdrawEnabled: boolean;
  depositEnabled: boolean;
  aggregator: string;
  timestamp: number;
}
