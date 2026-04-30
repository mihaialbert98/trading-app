import type { OHLCV } from '@/types/stock';

/**
 * Calculate EMA from raw OHLCV data (using close prices).
 * Returns an array of the same length as input.
 * First (period - 1) values are null (warm-up period).
 */
export function calculateEMA(data: OHLCV[], period: number): (number | null)[] {
  const closes = data.map((d) => d.close);
  return calculateEMAFromValues(closes, period);
}

/**
 * Calculate EMA from an array of raw values.
 * Used internally by MACD and other indicators.
 * Returns an array of the same length as input.
 * First (period - 1) values are null (warm-up period).
 */
export function calculateEMAFromValues(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);

  if (values.length < period) return result;

  const multiplier = 2 / (period + 1);

  // Seed: simple average of first `period` values
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += values[i];
  }
  let ema = sum / period;
  result[period - 1] = ema;

  // Compute EMA for the rest
  for (let i = period; i < values.length; i++) {
    ema = (values[i] - ema) * multiplier + ema;
    result[i] = ema;
  }

  return result;
}
