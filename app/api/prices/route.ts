import { NextResponse } from 'next/server';
import * as ccxt from 'ccxt';

// 创建交易所实例并配置
const createExchanges = () => {
  // 为每个交易所设置代理选项
  const proxyOptions = {
    'enableRateLimit': true,
    'timeout': 30000, // 增加超时时间到30秒
  };

  return {
    binance: new ccxt.binance({
      ...proxyOptions,
    }),
    okx: new ccxt.okx({
      ...proxyOptions,
    }),
    bitget: new ccxt.bitget({
      ...proxyOptions,
    }),
    bybit: new ccxt.bybit({
      ...proxyOptions,
    })
  };
};

export async function GET() {
  try {
    // 每次请求创建新的交易所实例
    const exchanges = createExchanges();
    
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

    // 设置 CORS 头部
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      prices
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('获取价格时出错:', error);
    return NextResponse.json(
      { success: false, error: '获取价格时出错' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

interface PriceResult {
  exchange: string;
  price: number | undefined;
}

async function fetchPrice(exchange: ccxt.Exchange, symbol: string, exchangeName: string): Promise<PriceResult | null> {
  try {
    // 添加错误处理和重试逻辑
    let retries = 3;
    let ticker;
    
    while (retries > 0) {
      try {
        ticker = await exchange.fetchTicker(symbol);
        break; // 成功获取数据，跳出循环
      } catch (err) {
        retries--;
        if (retries === 0) throw err; // 重试次数用完，抛出错误
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
      }
    }
    
    return {
      exchange: exchangeName,
      price: ticker?.last ?? 0 // 使用可选链和空值合并运算符
    };
  } catch (error) {
    console.error(`从 ${exchangeName} 获取价格时出错:`, error);
    return null;
  }
}
