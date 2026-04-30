import { useStore } from '@/store';
import { useStockData, type IndicatorsResponse } from '@/hooks/useStockData';
import type { EMAResult, SMAResult } from '@/types/indicators';

export interface ProcessedIndicators {
  rsi?: import('@/types/indicators').RSIResult;
  macd?: import('@/types/indicators').MACDResult;
  bollinger?: import('@/types/indicators').BollingerResult;
  ema?: EMAResult[];
  sma?: SMAResult[];
  stochastic?: import('@/types/indicators').StochasticResult;
  atr?: import('@/types/indicators').ATRResult;
  volume?: import('@/types/indicators').VolumeResult;
}

function processIndicators(
  raw: IndicatorsResponse | null,
  activeIndicators: string[],
  emaPeriods: number[],
  smaPeriods: number[]
): ProcessedIndicators {
  if (!raw) return {};

  const out: ProcessedIndicators = {};

  if (activeIndicators.includes('RSI')) out.rsi = raw.rsi;
  if (activeIndicators.includes('MACD')) out.macd = raw.macd;
  if (activeIndicators.includes('BOLLINGER')) out.bollinger = raw.bollinger;
  if (activeIndicators.includes('STOCHASTIC')) out.stochastic = raw.stochastic;
  if (activeIndicators.includes('ATR')) out.atr = raw.atr;
  if (activeIndicators.includes('VOLUME')) out.volume = raw.volume;

  if (activeIndicators.includes('EMA') && raw.ema) {
    out.ema = emaPeriods
      .filter((p) => raw.ema[p] !== undefined)
      .map((p) => ({ values: raw.ema[p], period: p }));
  }

  if (activeIndicators.includes('SMA') && raw.sma) {
    out.sma = smaPeriods
      .filter((p) => raw.sma[p] !== undefined)
      .map((p) => ({ values: raw.sma[p], period: p }));
  }

  return out;
}

export function useIndicators(symbol: string | null) {
  const { activeIndicators, emaPeriods, smaPeriods, interval, timeframe } = useStore();
  const { indicators, isLoading, error } = useStockData(symbol, interval, timeframe);

  const processed = processIndicators(indicators, activeIndicators, emaPeriods, smaPeriods);

  return {
    indicators: processed,
    isLoading,
    error,
  };
}
