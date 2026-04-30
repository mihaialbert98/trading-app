import type { OHLCV } from '@/types/stock';
import type { BollingerResult } from '@/types/indicators';

/**
 * Calculate Bollinger Bands using a simple moving average and standard deviation.
 * Returns arrays of the same length as input.
 * First (period - 1) values are null (warm-up period).
 */
export function calculateBollinger(
  data: OHLCV[],
  period = 20,
  stdDevMultiplier = 2,
): BollingerResult {
  const n = data.length;
  const upper: (number | null)[] = new Array(n).fill(null);
  const middle: (number | null)[] = new Array(n).fill(null);
  const lower: (number | null)[] = new Array(n).fill(null);

  if (n < period) return { upper, middle, lower };

  // Initial window sum for SMA
  let windowSum = 0;
  for (let i = 0; i < period; i++) {
    windowSum += data[i].close;
  }

  for (let i = period - 1; i < n; i++) {
    if (i > period - 1) {
      // Slide window: add new, remove oldest
      windowSum += data[i].close - data[i - period].close;
    }

    const sma = windowSum / period;

    // Compute population standard deviation over the window
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j].close - sma;
      variance += diff * diff;
    }
    const stdDev = Math.sqrt(variance / period);

    middle[i] = sma;
    upper[i] = sma + stdDevMultiplier * stdDev;
    lower[i] = sma - stdDevMultiplier * stdDev;
  }

  return { upper, middle, lower };
}
