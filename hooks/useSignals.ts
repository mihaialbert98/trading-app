import { useMemo } from 'react';
import { useStockData, type IndicatorsResponse } from '@/hooks/useStockData';
import { useStore } from '@/store';
import { evaluateCustomRules } from '@/lib/signals/custom-signals';
import type { EMAResult, SMAResult } from '@/types/indicators';

function extractEma(raw: IndicatorsResponse): EMAResult[] {
  if (!raw.ema) return [];
  return Object.entries(raw.ema).map(([p, values]) => ({
    period: parseInt(p, 10),
    values,
  }));
}

function extractSma(raw: IndicatorsResponse): SMAResult[] {
  if (!raw.sma) return [];
  return Object.entries(raw.sma).map(([p, values]) => ({
    period: parseInt(p, 10),
    values,
  }));
}

export function useSignals(symbol: string | null) {
  const { interval, timeframe, customRules } = useStore();
  const { data: ohlcv, signals: builtinSignals, indicators, isLoading, error } = useStockData(
    symbol,
    interval,
    timeframe,
  );

  const signals = useMemo(() => {
    const enabledRules = customRules.filter((r) => r.enabled);
    let custom = [] as typeof builtinSignals;

    if (enabledRules.length > 0 && ohlcv && ohlcv.length > 0 && indicators) {
      custom = evaluateCustomRules(enabledRules, {
        ohlcv,
        rsi: indicators.rsi?.values ?? [],
        macd: indicators.macd ?? { macd: [], signal: [], histogram: [] },
        bollinger: indicators.bollinger ?? { upper: [], middle: [], lower: [] },
        ema: extractEma(indicators),
        sma: extractSma(indicators),
        volume: indicators.volume ?? null,
      });
    }

    return [...builtinSignals, ...custom].sort((a, b) => b.timestamp - a.timestamp);
  }, [builtinSignals, customRules, ohlcv, indicators]);

  return { signals, isLoading, error };
}
