import type { OHLCV } from '@/types/stock';
import type { ATRResult } from '@/types/indicators';

/**
 * Calculate ATR (Average True Range) using Wilder's smoothing.
 *
 * True Range = max(high - low, |high - prev_close|, |low - prev_close|)
 * ATR = Wilder's smoothed average of TR
 *
 * Returns an array of the same length as input.
 * First `period` values are null (warm-up period).
 */
export function calculateATR(data: OHLCV[], period = 14): ATRResult {
  const n = data.length;
  const values: (number | null)[] = new Array(n).fill(null);

  if (n <= period) return { values };

  // Compute true range for each bar (starting at index 1, since we need prev close)
  const tr: number[] = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    const highLow = data[i].high - data[i].low;
    const highPrevClose = Math.abs(data[i].high - data[i - 1].close);
    const lowPrevClose = Math.abs(data[i].low - data[i - 1].close);
    tr[i] = Math.max(highLow, highPrevClose, lowPrevClose);
  }
  // First bar TR = high - low (no previous close)
  tr[0] = data[0].high - data[0].low;

  // Initial ATR: simple average of first `period` TR values (indices 0..period-1)
  let atr = 0;
  for (let i = 0; i < period; i++) {
    atr += tr[i];
  }
  atr /= period;
  values[period - 1] = atr;

  // Wilder's smoothing for subsequent values
  for (let i = period; i < n; i++) {
    atr = (atr * (period - 1) + tr[i]) / period;
    values[i] = atr;
  }

  return { values };
}
