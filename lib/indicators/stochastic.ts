import type { OHLCV } from '@/types/stock';
import type { StochasticResult } from '@/types/indicators';

/**
 * Calculate Stochastic Oscillator (%K and %D).
 *
 * Steps:
 * 1. Raw %K = (close - lowest_low(kPeriod)) / (highest_high(kPeriod) - lowest_low(kPeriod)) * 100
 * 2. Smoothed %K = SMA(raw %K, smooth)
 * 3. %D = SMA(smoothed %K, dPeriod)
 *
 * Returns arrays of the same length as input, null during warm-up.
 */
export function calculateStochastic(
  data: OHLCV[],
  kPeriod = 14,
  dPeriod = 3,
  smooth = 3,
): StochasticResult {
  const n = data.length;
  const k: (number | null)[] = new Array(n).fill(null);
  const d: (number | null)[] = new Array(n).fill(null);

  if (n < kPeriod) return { k, d };

  // Step 1: Compute raw %K for each valid index
  const rawK: (number | null)[] = new Array(n).fill(null);

  for (let i = kPeriod - 1; i < n; i++) {
    let lowestLow = data[i].low;
    let highestHigh = data[i].high;

    for (let j = i - kPeriod + 1; j < i; j++) {
      if (data[j].low < lowestLow) lowestLow = data[j].low;
      if (data[j].high > highestHigh) highestHigh = data[j].high;
    }

    const range = highestHigh - lowestLow;
    if (range === 0) {
      rawK[i] = 50; // Avoid division by zero — use midpoint
    } else {
      rawK[i] = ((data[i].close - lowestLow) / range) * 100;
    }
  }

  // Step 2: Smooth %K (SMA of rawK over `smooth` periods)
  const smoothedK: (number | null)[] = new Array(n).fill(null);
  const smoothStart = kPeriod - 1 + smooth - 1; // first valid index for smoothed K

  if (smooth === 1) {
    // No smoothing
    for (let i = 0; i < n; i++) {
      smoothedK[i] = rawK[i];
    }
  } else {
    for (let i = smoothStart; i < n; i++) {
      let sum = 0;
      let count = 0;
      for (let j = i - smooth + 1; j <= i; j++) {
        if (rawK[j] !== null) {
          sum += rawK[j] as number;
          count++;
        }
      }
      if (count === smooth) {
        smoothedK[i] = sum / smooth;
      }
    }
  }

  // Copy smoothedK to k output
  for (let i = 0; i < n; i++) {
    k[i] = smoothedK[i];
  }

  // Step 3: %D = SMA of smoothed %K over dPeriod
  const dStart = smoothStart + dPeriod - 1;

  for (let i = dStart; i < n; i++) {
    let sum = 0;
    let count = 0;
    for (let j = i - dPeriod + 1; j <= i; j++) {
      if (smoothedK[j] !== null) {
        sum += smoothedK[j] as number;
        count++;
      }
    }
    if (count === dPeriod) {
      d[i] = sum / dPeriod;
    }
  }

  return { k, d };
}
