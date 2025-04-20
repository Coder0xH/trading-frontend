import { NextResponse } from 'next/server';
import * as ccxt from 'ccxt';

// 创建交易所实例
const exchanges = {
  binance: new ccxt.binance(),
  okx: new ccxt.okx(),
  bitget: new ccxt.bitget(),
  bybit: new ccxt.bybit()
};

export async function GET() {
  try {
    // 并行获取所有交易所的 BTC/USDT 价格
    const results = await Promise.all([
      fetchPrice(exchanges.binance, 'BTC/USDT', 'binance'),
      fetchPrice(exchanges.okx, 'BTC/USDT', 'okx'),
      fetchPrice(exchanges.bitget, 'BTC/USDT', 'bitget'),
      fetchPrice(exchanges.bybit, 'BTC/USDT', 'bybit')
    ]);

    // 将结果组合成一个对象
    const prices = results.reduce((acc, curr) => {
      if (curr) {
        acc[curr.exchange] = curr.price;
      }
      return acc;
    }, {} as Record<string, number | undefined>);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      prices
    });
  } catch (error) {
    console.error('获取价格时出错:', error);
    return NextResponse.json(
      { success: false, error: '获取价格时出错' },
      { status: 500 }
    );
  }
}

interface PriceResult {
  exchange: string;
  price: number | undefined;
}

async function fetchPrice(exchange: ccxt.Exchange, symbol: string, exchangeName: string): Promise<PriceResult | null> {
  try {
    const ticker = await exchange.fetchTicker(symbol);
    return {
      exchange: exchangeName,
      price: ticker.last ?? 0 // 使用空值合并运算符
    };
  } catch (error) {
    console.error(`从 ${exchangeName} 获取价格时出错:`, error);
    return null;
  }
}
