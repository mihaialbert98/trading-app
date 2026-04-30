import type { OHLCV } from '@/types/stock';
import type { VolumeResult } from '@/types/indicators';

/**
 * Calculate volume bars and a rolling average volume line.
 * Returns volumes array (same length as input) and avgVolume
 * where first (avgPeriod - 1) values are null.
 */
export function calculateVolume(data: OHLCV[], avgPeriod = 20): VolumeResult {
  const n = data.length;
  const volumes: number[] = data.map((d) => d.volume);
  const avgVolume: (number | null)[] = new Array(n).fill(null);

  if (n < avgPeriod) return { volumes, avgVolume };

  // Sliding window sum for average
  let windowSum = 0;
  for (let i = 0; i < avgPeriod; i++) {
    windowSum += volumes[i];
  }
  avgVolume[avgPeriod - 1] = windowSum / avgPeriod;

  for (let i = avgPeriod; i < n; i++) {
    windowSum += volumes[i] - volumes[i - avgPeriod];
    avgVolume[i] = windowSum / avgPeriod;
  }

  return { volumes, avgVolume };
}
