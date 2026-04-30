import useSWR from 'swr';
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

const fetcher = <T>(url: string): Promise<T> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json() as Promise<T>;
  });

function isMarketHours(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;

  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const year = now.getFullYear();
  const marchDate = new Date(year, 2, 1);
  marchDate.setDate(marchDate.getDate() + ((7 - marchDate.getDay()) % 7) + 7);
  const novDate = new Date(year, 10, 1);
  novDate.setDate(novDate.getDate() + ((7 - novDate.getDay()) % 7));
  const isDST = now >= marchDate && now < novDate;
  const etOffset = isDST ? -4 : -5;
  const etDate = new Date(utcMs + etOffset * 3600000);

  const etTime = etDate.getHours() * 60 + etDate.getMinutes();
  return etTime >= 9 * 60 + 30 && etTime < 16 * 60;
}

export function useStockData(
  symbol: string | null,
  interval: string,
  timeframe: string
) {
  const key = symbol
    ? `/api/history?symbol=${encodeURIComponent(symbol)}&interval=${interval}&range=${timeframe}`
    : null;

  const { data, isLoading, error, mutate } = useSWR<HistoryResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    data: data?.ohlcv ?? null,
    indicators: data?.indicators ?? null,
    signals: data?.signals ?? [],
    isLoading,
    error: error as Error | null,
    mutate,
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
    }
  );

  return {
    quote: data ?? null,
    isLoading,
    error: error as Error | null,
  };
}
