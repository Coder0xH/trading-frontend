'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  BinanceTokenResponse, 
  SyncStatusResponse, 
  getTokens, 
  getTokensWithUsdtPairs, 
  getTokensSyncStatus, 
  syncExchangeTokens, 
  syncUsdtTradingPairs 
} from '@/app/api/token/service';
import { useToast } from '@/components/ui/use-toast';

/**
 * 代币上下文状态接口
 */
interface TokenContextState {
  // 数据状态
  tokens: BinanceTokenResponse[];
  usdtPairTokens: BinanceTokenResponse[];
  syncStatus: SyncStatusResponse | null;
  selectedToken: BinanceTokenResponse | null;
  copiedAddress: string | null;
  
  // UI状态
  activeTab: 'all' | 'usdt';
  loading: boolean;
  syncLoading: boolean;
  searchTerm: string;
  hasContractFilter: boolean | undefined;
  page: number;
  limit: number;
  
  // 操作方法
  setActiveTab: (tab: 'all' | 'usdt') => void;
  setSearchTerm: (term: string) => void;
  setHasContractFilter: (hasContract: boolean | undefined) => void;
  setPage: (page: number) => void;
  setSelectedToken: (token: BinanceTokenResponse | null) => void;
  
  // 业务方法
  loadTokens: () => Promise<void>;
  loadUsdtPairTokens: () => Promise<void>;
  loadSyncStatus: () => Promise<void>;
  syncTokens: () => Promise<void>;
  syncUsdtPairs: () => Promise<void>;
  handleSearch: () => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  copyToClipboard: (text: string) => void;
  
  // 工具方法
  getNetworkCount: (token: BinanceTokenResponse) => number;
  getFirstNetworkAndAddress: (token: BinanceTokenResponse) => { network: string, address: string } | null;
  formatDate: (dateString: string | null) => string;
}

/**
 * 创建代币上下文
 */
const TokenContext = createContext<TokenContextState | undefined>(undefined);

/**
 * TokenProvider属性接口
 */
interface TokenProviderProps {
  readonly children: ReactNode;
}

/**
 * 代币上下文提供者组件
 * 
 * @param props - 组件属性
 * @param props.children - 子组件
 */
export function TokenProvider({ children }: TokenProviderProps): React.ReactElement {
  // 数据状态
  const [tokens, setTokens] = useState<BinanceTokenResponse[]>([]);
  const [usdtPairTokens, setUsdtPairTokens] = useState<BinanceTokenResponse[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatusResponse | null>(null);
  const [selectedToken, setSelectedToken] = useState<BinanceTokenResponse | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
  // UI状态
  const [activeTab, setActiveTab] = useState<'all' | 'usdt'>('all');
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasContractFilter, setHasContractFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 20;
  
  const { toast } = useToast();

  /**
   * 加载代币数据
   */
  const loadTokens = async (): Promise<void> => {
    try {
      setLoading(true);
      const skip = (page - 1) * limit;
      const data = await getTokens(skip, limit, searchTerm ?? undefined, hasContractFilter);
      setTokens(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast({
        title: '加载代币失败',
        description: `获取代币数据时发生错误: ${errorMessage}`,
        variant: 'destructive',
      });
      console.error('加载代币失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载USDT交易对代币
   */
  const loadUsdtPairTokens = async (): Promise<void> => {
    try {
      setLoading(true);
      const skip = (page - 1) * limit;
      const data = await getTokensWithUsdtPairs(skip, limit);
      setUsdtPairTokens(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast({
        title: '加载USDT交易对代币失败',
        description: `获取USDT交易对代币数据时发生错误: ${errorMessage}`,
        variant: 'destructive',
      });
      console.error('加载USDT交易对代币失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载同步状态
   */
  const loadSyncStatus = async (): Promise<void> => {
    try {
      const status = await getTokensSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast({
        title: '加载同步状态失败',
        description: `获取同步状态数据时发生错误: ${errorMessage}`,
        variant: 'destructive',
      });
      console.error('加载同步状态失败:', error);
    }
  };

  /**
   * 同步代币信息
   */
  const syncTokens = async (): Promise<void> => {
    try {
      setSyncLoading(true);
      const response = await syncExchangeTokens({ limit: 100, force_update: false });
      
      if (response.success) {
        toast({
          title: '同步成功',
          description: `已同步 ${response.synced_count} 个代币，耗时 ${response.elapsed_time.toFixed(2)} 秒`,
        });
        
        // 重新加载数据
        loadSyncStatus();
        if (activeTab === 'all') {
          loadTokens();
        } else {
          loadUsdtPairTokens();
        }
      } else {
        toast({
          title: '同步失败',
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast({
        title: '同步失败',
        description: `同步代币信息时发生错误: ${errorMessage}`,
        variant: 'destructive',
      });
      console.error('同步代币失败:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  /**
   * 同步USDT交易对
   */
  const syncUsdtPairs = async (): Promise<void> => {
    try {
      setSyncLoading(true);
      await syncUsdtTradingPairs();
      
      toast({
        title: '同步USDT交易对成功',
        description: '已更新USDT交易对信息',
      });
      
      // 重新加载数据
      loadSyncStatus();
      if (activeTab === 'usdt') {
        loadUsdtPairTokens();
      } else {
        loadTokens();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast({
        title: '同步USDT交易对失败',
        description: `同步USDT交易对信息时发生错误: ${errorMessage}`,
        variant: 'destructive',
      });
      console.error('同步USDT交易对失败:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  /**
   * 处理搜索
   */
  const handleSearch = (): void => {
    setPage(1);
    loadTokens();
  };

  /**
   * 处理上一页
   */
  const handlePrevPage = (): void => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  /**
   * 处理下一页
   */
  const handleNextPage = (): void => {
    setPage(page + 1);
  };

  /**
   * 复制合约地址
   * 
   * @param text - 要复制的文本
   */
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedAddress(text);
        toast({
          title: '已复制',
          description: '合约地址已复制到剪贴板',
        });
        setTimeout(() => setCopiedAddress(null), 2000);
      })
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        toast({
          title: '复制失败',
          description: `无法复制到剪贴板: ${errorMessage}`,
          variant: 'destructive',
        });
        console.error('复制到剪贴板失败:', error);
      });
  };

  /**
   * 获取网络数量
   * 
   * @param token - 代币数据
   * @returns 网络数量
   */
  const getNetworkCount = (token: BinanceTokenResponse): number => {
    if (!token.contract_addresses) return 0;
    return Object.keys(token.contract_addresses).length;
  };

  /**
   * 获取第一个网络和地址
   * 
   * @param token - 代币数据
   * @returns 网络和地址对象，如果没有则返回null
   */
  const getFirstNetworkAndAddress = (token: BinanceTokenResponse): { network: string, address: string } | null => {
    if (!token.contract_addresses) return null;
    const entries = Object.entries(token.contract_addresses);
    if (entries.length === 0) return null;
    
    const [network, address] = entries[0];
    return { network, address };
  };

  /**
   * 格式化日期
   * 
   * @param dateString - 日期字符串
   * @returns 格式化后的日期字符串
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '未知';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 初始加载
  useEffect(() => {
    loadTokens();
    loadSyncStatus();
  }, []);

  // 页码变化时重新加载
  useEffect(() => {
    if (activeTab === 'all') {
      loadTokens();
    } else {
      loadUsdtPairTokens();
    }
  }, [page, activeTab]);

  // 标签变化时处理
  const handleTabChange = (tab: 'all' | 'usdt'): void => {
    setActiveTab(tab);
    setPage(1);
    
    if (tab === 'all') {
      loadTokens();
    } else {
      loadUsdtPairTokens();
    }
  };

  // 使用useMemo优化上下文值，避免不必要的重新渲染
  const value = useMemo<TokenContextState>(() => ({
    // 数据状态
    tokens,
    usdtPairTokens,
    syncStatus,
    selectedToken,
    copiedAddress,
    
    // UI状态
    activeTab,
    loading,
    syncLoading,
    searchTerm,
    hasContractFilter,
    page,
    limit,
    
    // 操作方法
    setActiveTab: handleTabChange,
    setSearchTerm,
    setHasContractFilter,
    setPage,
    setSelectedToken,
    
    // 业务方法
    loadTokens,
    loadUsdtPairTokens,
    loadSyncStatus,
    syncTokens,
    syncUsdtPairs,
    handleSearch,
    handlePrevPage,
    handleNextPage,
    copyToClipboard,
    
    // 工具方法
    getNetworkCount,
    getFirstNetworkAndAddress,
    formatDate
  }), [
    tokens, usdtPairTokens, syncStatus, selectedToken, copiedAddress,
    activeTab, loading, syncLoading, searchTerm, hasContractFilter, page,
    // 方法不需要添加到依赖数组中，因为它们不会改变
  ]);

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
}

/**
 * 使用代币上下文的自定义Hook
 * 
 * @returns 代币上下文状态
 * @throws 如果在TokenProvider外部使用则抛出错误
 */
export function useTokenContext(): TokenContextState {
  const context = useContext(TokenContext);
  
  if (context === undefined) {
    throw new Error('useTokenContext必须在TokenProvider内部使用');
  }
  
  return context;
}
