/**
 * Token API服务
 * 用于与后端API交互，获取代币相关数据
 * 
 */
const API_BASE_URL = 'http://13.250.110.158:8000';

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
  limit: number;
  force_update: boolean;
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
 * 获取代币统计信息
 * @returns 代币统计信息
 */
export const getTokenStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tokens/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取代币统计信息失败:', error);
    throw error;
  }
};

/**
 * 获取代币列表
 * @param skip 跳过的记录数
 * @param limit 返回的记录数
 * @param symbol 代币符号
 * @param hasContract 是否有合约地址
 * @param hasUsdtPair 是否有USDT交易对
 * @returns 代币列表
 */
export const getTokens = async (
  skip = 0,
  limit = 100,
  symbol?: string,
  hasContract?: boolean,
  hasUsdtPair?: boolean
): Promise<BinanceTokenResponse[]> => {
  try {
    let url = `${API_BASE_URL}/api/tokens?skip=${skip}&limit=${limit}`;
    
    if (symbol) url += `&symbol=${encodeURIComponent(symbol)}`;
    if (hasContract !== undefined) url += `&has_contract=${hasContract}`;
    if (hasUsdtPair !== undefined) url += `&has_usdt_pair=${hasUsdtPair}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取代币列表失败:', error);
    throw error;
  }
};

/**
 * 获取有USDT交易对的代币列表
 * @param skip 跳过的记录数
 * @param limit 返回的记录数
 * @returns 有USDT交易对的代币列表
 */
export const getTokensWithUsdtPairs = async (
  skip = 0,
  limit = 100
): Promise<BinanceTokenResponse[]> => {
  try {
    const url = `${API_BASE_URL}/api/tokens/usdt-pairs?skip=${skip}&limit=${limit}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取有USDT交易对的代币列表失败:', error);
    throw error;
  }
};

/**
 * 根据ID获取代币详情
 * @param tokenId 代币ID
 * @returns 代币详情
 */
export const getTokenById = async (tokenId: number): Promise<BinanceTokenResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tokens/${tokenId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('根据ID获取代币详情失败:', error);
    throw error;
  }
};

/**
 * 根据符号获取代币详情
 * @param symbol 代币符号
 * @returns 代币详情
 */
export const getTokenBySymbol = async (symbol: string): Promise<BinanceTokenResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tokens/symbol/${symbol}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('根据符号获取代币详情失败:', error);
    throw error;
  }
};

/**
 * 根据合约地址获取代币
 * @param address 合约地址
 * @returns 代币列表
 */
export const getTokensByContract = async (address: string): Promise<BinanceTokenResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tokens/contract/${address}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('根据合约地址获取代币失败:', error);
    throw error;
  }
};

/**
 * 同步交易所代币信息
 * @param request 同步请求
 * @returns 同步响应
 */
export const syncExchangeTokens = async (request: SyncRequest = { limit: 100, force_update: false }): Promise<SyncResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sync/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('同步交易所代币信息失败:', error);
    throw error;
  }
};

/**
 * 同步USDT交易对信息
 * @returns 同步响应
 */
export const syncUsdtTradingPairs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sync/usdt-pairs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('同步USDT交易对信息失败:', error);
    throw error;
  }
};

/**
 * 获取代币同步状态
 * @returns 同步状态响应
 */
export const getTokensSyncStatus = async (): Promise<SyncStatusResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sync/tokens/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取代币同步状态失败:', error);
    throw error;
  }
};
