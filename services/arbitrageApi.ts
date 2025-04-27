/**
 * 套利策略 API 服务
 * 提供与套利策略相关的所有 API 调用
 */

// API 基础 URL - 使用相对路径，由Next.js处理
const API_BASE_URL = '';

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
 * 套利策略配置接口
 */
export interface ArbitrageStrategyConfig {
  name: string;
  enabled?: boolean;
  symbol: string;
  chain_id: string;
  buy_exchange: string;
  sell_exchange: string;
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
}

/**
 * 套利策略响应接口
 */
export interface ArbitrageStrategy extends ArbitrageStrategyConfig {
  id: string;
  created_at: string;
  updated_at: string;
  last_execution?: string | null;
  total_executions?: number;
  total_profit?: number;
  success_rate?: number;
}

/**
 * 策略执行记录接口
 */
export interface StrategyExecution {
  id: string;
  strategy_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  profit?: number;
  details?: any;
  error?: string;
}

/**
 * 获取套利策略列表
 * @param enabled - 可选，是否只返回启用的策略
 * @param skip - 可选，跳过记录数
 * @param limit - 可选，返回记录数
 * @returns 策略列表
 */
export const listArbitrageStrategies = async (
  enabled?: boolean,
  skip: number = 0,
  limit: number = 100
): Promise<ArbitrageStrategy[]> => {
  try {
    const params = new URLSearchParams();
    if (enabled !== undefined) params.append('enabled', enabled.toString());
    if (skip) params.append('skip', skip.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`/api/arbitrage?${params.toString()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('获取套利策略列表失败:', error);
    throw error;
  }
};

/**
 * 获取套利策略详情
 * @param strategyId - 策略ID
 * @returns 策略详情
 */
export const getArbitrageStrategy = async (strategyId: string): Promise<ArbitrageStrategy> => {
  try {
    const response = await fetch(`/api/arbitrage/${strategyId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`获取套利策略 ${strategyId} 详情失败:`, error);
    throw error;
  }
};

/**
 * 创建套利策略
 * @param strategyConfig - 策略配置
 * @returns 创建结果
 */
export const createArbitrageStrategy = async (
  strategyConfig: ArbitrageStrategyConfig
): Promise<any> => {
  try {
    const response = await fetch(`/api/arbitrage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(strategyConfig),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('创建套利策略失败:', error);
    throw error;
  }
};

/**
 * 更新套利策略
 * @param strategyId - 策略ID
 * @param strategyConfig - 策略配置
 * @returns 更新结果
 */
export const updateArbitrageStrategy = async (
  strategyId: string,
  strategyConfig: ArbitrageStrategyConfig
): Promise<any> => {
  try {
    const response = await fetch(`/api/arbitrage/${strategyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(strategyConfig),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`更新套利策略 ${strategyId} 失败:`, error);
    throw error;
  }
};

/**
 * 删除套利策略
 * @param strategyId - 策略ID
 * @returns 删除结果
 */
export const deleteArbitrageStrategy = async (strategyId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/arbitrage/${strategyId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`删除套利策略 ${strategyId} 失败:`, error);
    throw error;
  }
};

/**
 * 执行套利策略
 * @param strategyId - 策略ID
 * @returns 执行结果
 */
export const executeArbitrageStrategy = async (strategyId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/arbitrage/${strategyId}/execute`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`执行套利策略 ${strategyId} 失败:`, error);
    throw error;
  }
};

/**
 * 获取策略执行记录
 * @param strategyId - 策略ID
 * @param limit - 可选，返回记录数
 * @param offset - 可选，偏移量
 * @returns 执行记录列表
 */
export const listStrategyExecutions = async (
  strategyId: string,
  limit: number = 10,
  offset: number = 0
): Promise<StrategyExecution[]> => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const response = await fetch(
      `/api/arbitrage/${strategyId}/executions?${params.toString()}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`获取策略 ${strategyId} 执行记录失败:`, error);
    throw error;
  }
};

/**
 * 获取执行详情
 * @param executionId - 执行ID
 * @returns 执行详情
 */
export const getExecutionDetails = async (executionId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/arbitrage/executions/${executionId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`获取执行 ${executionId} 详情失败:`, error);
    throw error;
  }
};
