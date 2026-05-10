import useSWR from 'swr';
import { useCallback } from 'react';
import type { OHLCV, Quote } from '@/types/stock';
import type { SignalEvent } from '@/types/signals';
import type {
  RSIResult,
  MACDResult,
  BollingerResult,
  ATRResult,
  VolumeResult,
  StochasticResult,
} from '@/types/indicators';
import { isMarketHours } from '@/lib/market';

export interface IndicatorsResponse {
  rsi: RSIResult;
  macd: MACDResult;
  bollinger: BollingerResult;
  ema: Record<string, (number | null)[]>;
  sma: Record<string, (number | null)[]>;
  stochastic: StochasticResult;
  atr: ATRResult;
  volume: VolumeResult;
}

export interface HistoryResponse {
  ohlcv: OHLCV[];
  indicators: IndicatorsResponse;
  signals: SignalEvent[];
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string; code?: string };
      if (body.error) message = body.error;
    } catch { /* ignore */ }
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}


export function useStockData(
  symbol: string | null,
  interval: string,
  timeframe: string
) {
  // '4h' is a client-side aggregation of 1h candles — the API only knows '1h'
  const apiInterval = interval === '4h' ? '1h' : interval;
  const key = symbol
    ? `/api/history?symbol=${encodeURIComponent(symbol)}&interval=${apiInterval}&range=${timeframe}`
    : null;

  const { data, isLoading, error, mutate } = useSWR<HistoryResponse>(key, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: isMarketHours() ? 30000 : 0,
    dedupingInterval: 25000,
    keepPreviousData: true,
    onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
      // Don't retry on 404 — symbol not found is permanent
      if ((err as { status?: number }).status === 404) return;
      // Max 3 retries with exponential backoff
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), Math.min(1000 * 2 ** retryCount, 15000));
    },
  });

  // Fetch additional historical candles for a custom date window (scroll-back)
  const fetchHistoryChunk = useCallback(
    async (period1: Date): Promise<OHLCV[] | null> => {
      if (!symbol) return null;
      try {
        const url = `/api/history?symbol=${encodeURIComponent(symbol)}&interval=${apiInterval}&range=${timeframe}&period1=${period1.toISOString()}`;
        const result = await fetcher<HistoryResponse>(url);
        return result.ohlcv;
      } catch {
        return null;
      }
    },
    [symbol, interval, timeframe]
  );

  return {
    data: data?.ohlcv ?? null,
    indicators: data?.indicators ?? null,
    signals: data?.signals ?? [],
    isLoading,
    error: error as (Error & { status?: number }) | null,
    mutate,
    fetchHistoryChunk,
  };
}

export function useQuote(symbol: string | null) {
  const { data, isLoading, error } = useSWR<Quote>(
    symbol ? `/api/quote?symbol=${encodeURIComponent(symbol)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: isMarketHours() ? 30000 : 0,
      dedupingInterval: 25000,
      onErrorRetry: (_err, _key, _config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), Math.min(1000 * 2 ** retryCount, 15000));
      },
    }
  );

  return {
    quote: data ?? null,
    isLoading,
    error: error as Error | null,
  };
}
