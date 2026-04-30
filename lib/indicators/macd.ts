import type { OHLCV } from '@/types/stock';
import type { MACDResult } from '@/types/indicators';
import { calculateEMAFromValues } from './ema';

/**
 * Calculate MACD (Moving Average Convergence/Divergence).
 * Uses EMA for all calculations.
 *
 * Returns arrays of the same length as input.
 * Null during warm-up periods:
 *   - macd line: null for first (slow - 1) indices
 *   - signal line: null for first (slow - 1 + signal - 1) indices
 *   - histogram: same nulls as signal line
 */
export function calculateMACD(
  data: OHLCV[],
  fast = 12,
  slow = 26,
  signal = 9,
): MACDResult {
  const n = data.length;
  const closes = data.map((d) => d.close);

  const fastEMA = calculateEMAFromValues(closes, fast);
  const slowEMA = calculateEMAFromValues(closes, slow);

  // MACD line = fastEMA - slowEMA (valid only where both are non-null, i.e., from index slow-1)
  const macdLine: (number | null)[] = new Array(n).fill(null);
  const macdStartIndex = slow - 1; // first index where slowEMA is valid

  for (let i = 0; i < n; i++) {
    const f = fastEMA[i];
    const s = slowEMA[i];
    if (f !== null && s !== null) {
      macdLine[i] = f - s;
    }
  }

  // Signal line = EMA of the MACD line, computed over the valid portion only
  const validMacdValues = macdLine
    .slice(macdStartIndex)
    .map((v) => (v !== null ? v : 0));

  const signalEMAOnValid = calculateEMAFromValues(validMacdValues, signal);

  // Map back to full-length arrays
  const signalLine: (number | null)[] = new Array(n).fill(null);
  const histogram: (number | null)[] = new Array(n).fill(null);

  for (let i = 0; i < signalEMAOnValid.length; i++) {
    const globalIndex = macdStartIndex + i;
    const sigVal = signalEMAOnValid[i];
    if (sigVal !== null && macdLine[globalIndex] !== null) {
      signalLine[globalIndex] = sigVal;
      histogram[globalIndex] = (macdLine[globalIndex] as number) - sigVal;
    }
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram,
  };
}
