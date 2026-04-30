import type { SignalEvent } from '@/types/signals';
import type { SignalContext } from './signal-types';
import { crossesAbove, crossesAboveValue } from '@/lib/utils/crossover';

/**
 * Detect all buy signals across the full OHLCV history.
 *
 * B1: RSI crosses above 30 (oversold recovery) → STRONG_BUY
 * B2: RSI crosses above 50 AND RSI was below 40 within last 5 candles → BUY
 * B3: MACD line crosses above Signal line AND histogram turns positive → BUY
 * B4: Close touches or goes below lower Bollinger Band AND RSI < 35 → BUY
 * B5: MACD crosses above 0 AND MACD line is above Signal line → BUY
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

    // B1: RSI crosses above 30 — standard oversold recovery threshold
    if (crossesAbove(rsiPrev, rsiCurr, 30)) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'STRONG_BUY',
        rule: 'B1',
        price: candle.close,
        description: 'Cumpărare Puternică — revenire din supravânzare',
      });
    }

    // B2: RSI crosses above 50 AND was below 40 within last 5 candles
    // The lookback filter avoids noise signals in sideways markets
    if (crossesAbove(rsiPrev, rsiCurr, 50)) {
      const lookback = Math.max(0, i - 5);
      const wasOversoldRecently = rsi.slice(lookback, i).some(
        (v) => v !== null && (v as number) < 40
      );
      if (wasOversoldRecently) {
        signals.push({
          timestamp: candle.timestamp,
          type: 'BUY',
          rule: 'B2',
          price: candle.close,
          description: 'Cumpărare Moderată — confirmare momentum',
        });
      }
    }

    // B3: MACD line crosses above Signal line AND histogram turns positive
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

    // B5: MACD crosses above 0 AND MACD line is already above Signal line
    // The Signal confirmation prevents late entries on zero-line bounces with no momentum
    if (
      crossesAbove(macdLinePrev, macdLineCurr, 0) &&
      macdLineCurr !== null &&
      signalCurr !== null &&
      macdLineCurr > signalCurr
    ) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'BUY',
        rule: 'B5',
        price: candle.close,
        description: 'Cumpărare — MACD trece peste zero',
      });
    }
  }

  return signals;
}
