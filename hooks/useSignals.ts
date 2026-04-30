import { useStockData } from '@/hooks/useStockData';
import { useStore } from '@/store';

export function useSignals(symbol: string | null) {
  const { interval, timeframe } = useStore();
  const { signals, isLoading, error } = useStockData(symbol, interval, timeframe);

  // Sort newest-first
  const sorted = [...signals].sort((a, b) => b.timestamp - a.timestamp);

  return {
    signals: sorted,
    isLoading,
    error,
  };
}
