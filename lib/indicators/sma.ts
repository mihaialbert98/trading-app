import type { OHLCV } from '@/types/stock';

/**
 * Calculate SMA (Simple Moving Average) from OHLCV data (using close prices).
 * Returns an array of the same length as input.
 * First (period - 1) values are null (warm-up period).
 */
export function calculateSMA(data: OHLCV[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(data.length).fill(null);

  if (data.length < period) return result;

  // Compute initial window sum
  let windowSum = 0;
  for (let i = 0; i < period; i++) {
    windowSum += data[i].close;
  }
  result[period - 1] = windowSum / period;

  // Slide the window
  for (let i = period; i < data.length; i++) {
    windowSum += data[i].close - data[i - period].close;
    result[i] = windowSum / period;
  }

  return result;
}
