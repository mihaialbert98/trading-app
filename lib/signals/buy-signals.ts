import type { SignalEvent } from '@/types/signals';
import type { SignalContext } from './signal-types';
import { crossesAbove, crossesAboveValue } from '@/lib/utils/crossover';

/**
 * Detect all buy signals across the full OHLCV history.
 *
 * B1: RSI crosses above 20 → STRONG_BUY
 * B2: RSI crosses above 50 → BUY
 * B3: MACD line crosses above Signal line AND histogram turns positive → BUY
 * B4: Close touches or goes below lower Bollinger Band AND RSI < 35 → BUY
 */
export function detectBuySignals(ctx: SignalContext): SignalEvent[] {
  const { ohlcv, rsi, macd, bollinger } = ctx;
  const signals: SignalEvent[] = [];

  for (let i = 1; i < ohlcv.length; i++) {
    const candle = ohlcv[i];

    const rsiCurr = rsi[i];
    const rsiPrev = rsi[i - 1];

    const macdLineCurr = macd.macd[i];
    const macdLinePrev = macd.macd[i - 1];
    const signalCurr = macd.signal[i];
    const signalPrev = macd.signal[i - 1];
    const histCurr = macd.histogram[i];
    const histPrev = macd.histogram[i - 1];

    const lowerCurr = bollinger.lower[i];

    // B1: RSI crosses above 20
    if (crossesAbove(rsiPrev, rsiCurr, 20)) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'STRONG_BUY',
        rule: 'B1',
        price: candle.close,
        description: 'Cumpărare Puternică — revenire din supravânzare',
      });
    }

    // B2: RSI crosses above 50
    if (crossesAbove(rsiPrev, rsiCurr, 50)) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'BUY',
        rule: 'B2',
        price: candle.close,
        description: 'Cumpărare Moderată — confirmare momentum',
      });
    }

    // B3: MACD line crosses above Signal line AND histogram turns positive (MACD > 0)
    const macdCrossedAboveSignal = crossesAboveValue(macdLinePrev, macdLineCurr, signalPrev, signalCurr);
    const histTurnsPositive =
      histPrev !== null && histCurr !== null && histPrev <= 0 && histCurr > 0;

    if (macdCrossedAboveSignal && histTurnsPositive) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'BUY',
        rule: 'B3',
        price: candle.close,
        description: 'Cumpărare — încrucișare MACD bullish',
      });
    }

    // B4: Close touches or goes below lower Bollinger Band AND RSI < 35
    if (
      lowerCurr !== null &&
      candle.close <= lowerCurr &&
      rsiCurr !== null &&
      rsiCurr < 35
    ) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'BUY',
        rule: 'B4',
        price: candle.close,
        description: 'Cumpărare — atingere Bollinger inferior',
      });
    }

  }

  return signals;
}
