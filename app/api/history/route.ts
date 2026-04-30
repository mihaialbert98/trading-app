import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getHistory } from '@/lib/yahoo';
import { calculateRSI } from '@/lib/indicators/rsi';
import { calculateMACD } from '@/lib/indicators/macd';
import { calculateBollinger } from '@/lib/indicators/bollinger';
import { calculateEMA } from '@/lib/indicators/ema';
import { calculateSMA } from '@/lib/indicators/sma';
import { calculateStochastic } from '@/lib/indicators/stochastic';
import { calculateATR } from '@/lib/indicators/atr';
import { calculateVolume } from '@/lib/indicators/volume';
import { detectBuySignals } from '@/lib/signals/buy-signals';
import { detectSellSignals } from '@/lib/signals/sell-signals';
import type { SignalEvent } from '@/types/signals';

// EMA periods to compute by default
const EMA_PERIODS = [9, 21, 50, 200] as const;
// SMA periods to compute by default
const SMA_PERIODS = [50, 200] as const;

const querySchema = z.object({
  symbol: z
    .string()
    .min(1, 'Symbol is required')
    .max(20, 'Symbol too long')
    .regex(/^[A-Za-z0-9.\-^=]+$/, 'Invalid symbol format'),
  interval: z.enum(['1h', '1d', '1wk', '1mo']).default('1d'),
  range: z
    .enum(['1d', '5d', '1mo', '3mo', '6mo', '1y', '5y'])
    .default('1y'),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const rawParams = {
    symbol: searchParams.get('symbol') ?? '',
    interval: searchParams.get('interval') ?? '1d',
    range: searchParams.get('range') ?? '1y',
  };

  const parsed = querySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid parameters' },
      { status: 400 },
    );
  }

  const { symbol, interval, range } = parsed.data;

  try {
    const ohlcv = await getHistory(symbol, interval, range);

    if (ohlcv.length === 0) {
      return NextResponse.json(
        { error: 'No historical data available for this symbol' },
        { status: 404 },
      );
    }

    // Compute all indicators server-side
    const rsi = calculateRSI(ohlcv, 14);
    const macd = calculateMACD(ohlcv, 12, 26, 9);
    const bollinger = calculateBollinger(ohlcv, 20, 2);

    const ema: Record<number, (number | null)[]> = {};
    for (const period of EMA_PERIODS) {
      ema[period] = calculateEMA(ohlcv, period);
    }

    const sma: Record<number, (number | null)[]> = {};
    for (const period of SMA_PERIODS) {
      sma[period] = calculateSMA(ohlcv, period);
    }

    const stochastic = calculateStochastic(ohlcv, 14, 3, 3);
    const atr = calculateATR(ohlcv, 14);
    const volume = calculateVolume(ohlcv, 20);

    // Detect signals
    const ema20 = calculateEMA(ohlcv, 20);

    const signalContext = {
      ohlcv,
      rsi,
      macd,
      bollinger,
      ema20,
    };

    const buySignals = detectBuySignals(signalContext);
    const sellSignals = detectSellSignals(signalContext);
    const signals: SignalEvent[] = [...buySignals, ...sellSignals].sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    return NextResponse.json({
      ohlcv,
      indicators: {
        rsi,
        macd,
        bollinger,
        ema,
        sma,
        stochastic,
        atr,
        volume,
      },
      signals,
    });
  } catch (err) {
    console.error('[api/history] Error fetching history:', err);
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 },
    );
  }
}
