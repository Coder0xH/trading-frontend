/**
 * 价格相关类型定义
 */

// 价格变化方向类型
export type PriceDirection = 'up' | 'down' | 'neutral';

// 支持的交易所名称
export type ExchangeName = 'binance' | 'okx' | 'bitget' | 'bybit';

// 交易所品牌颜色 - 根据实际 logo 颜色
export const exchangeColors: Record<ExchangeName, string> = {
  binance: '#F0B90B', // 币安金黄色
  okx: '#000000',     // OKX黑色
  bitget: '#00F2FE',  // Bitget青色
  bybit: '#1A1E3C'    // Bybit藏青色
};

// 交易所 logo 背景颜色
export const exchangeBackgroundColors: Record<ExchangeName, string> = {
  binance: '#000000', // 币安黑色背景
  okx: '#000000',     // OKX黑色背景
  bitget: '#00F2FE',  // Bitget青色背景
  bybit: '#1A1E3C'    // Bybit藏青色背景
};

// 交易所 logo 图标样式
export const exchangeLogoStyles: Record<ExchangeName, {
  color: string;
  backgroundColor: string;
  symbol: string;
}> = {
  binance: {
    color: '#F0B90B',
    backgroundColor: '#000000',
    symbol: '⬙'  // 币安菱形符号
  },
  okx: {
    color: '#FFFFFF',
    backgroundColor: '#000000',
    symbol: '▦'  // OKX方格符号
  },
  bitget: {
    color: '#000000',
    backgroundColor: '#00F2FE',
    symbol: '⟩⟨'  // Bitget箭头符号
  },
  bybit: {
    color: '#FFFFFF',
    backgroundColor: '#1A1E3C',
    symbol: 'B'  // Bybit字母B
  }
};

// API 返回的价格数据结构
export interface PriceData {
  readonly success: boolean;
  readonly timestamp: string;
  readonly prices: {
    readonly [key in ExchangeName]?: number;
  };
  readonly error?: string;
}

// 价格卡片组件属性
export interface PriceCardProps {
  readonly exchange: string;
  readonly exchangeName: ExchangeName;
  readonly price?: number;
  readonly isHigh?: boolean;
  readonly isLow?: boolean;
  readonly loading: boolean;
  readonly direction: PriceDirection;
}

// 动画价格组件属性
export interface AnimatedPriceProps {
  readonly value: number | null | undefined;
  readonly className?: string;
  readonly direction?: PriceDirection;
  readonly color?: string;
}

// 动画百分比组件属性
export interface AnimatedPercentageProps {
  readonly value: number | null | undefined;
  readonly className?: string;
}
