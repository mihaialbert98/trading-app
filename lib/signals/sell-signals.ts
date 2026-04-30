import type { SignalEvent } from '@/types/signals';
import type { SignalContext } from './signal-types';
import { crossesBelow, crossesBelowValue } from '@/lib/utils/crossover';

/**
 * Detect all sell signals across the full OHLCV history.
 *
 * S1: RSI crosses below 70 AND MACD crosses below Signal line within 3-candle window → STRONG_SELL
 * S2: MACD line crosses below Signal line while RSI > 60 → WARNING
 * S3: Close crosses below 20-day EMA AND 2+ consecutive down candles preceding → SELL
 * S4: MACD crosses below 0 AND MACD line is below Signal line → SELL
 */
export function detectSellSignals(ctx: SignalContext): SignalEvent[] {
  const { ohlcv, rsi, macd, ema20 } = ctx;
  const signals: SignalEvent[] = [];

  // For S1: track indices where RSI crossed below 70 so we can check the 3-candle window
  const rsiCrossedBelow70At: number[] = [];
  // For S1: track indices where MACD crossed below Signal line
  const macdCrossedBelowSignalAt: number[] = [];

  for (let i = 1; i < ohlcv.length; i++) {
    const candle = ohlcv[i];

    const rsiCurr = rsi[i];
    const rsiPrev = rsi[i - 1];

    const macdLineCurr = macd.macd[i];
    const macdLinePrev = macd.macd[i - 1];
    const signalCurr = macd.signal[i];
    const signalPrev = macd.signal[i - 1];

    // ------- S1 -------
    // Track RSI crossing below 70 (overbought exit)
    if (crossesBelow(rsiPrev, rsiCurr, 70)) {
      rsiCrossedBelow70At.push(i);
    }

    // Track MACD line crossing below Signal line (momentum reversal)
    const macdCrossedBelowSignal = crossesBelowValue(
      macdLinePrev,
      macdLineCurr,
      signalPrev,
      signalCurr,
    );
    if (macdCrossedBelowSignal) {
      macdCrossedBelowSignalAt.push(i);
    }

    // S1 fires when both events occur within a 3-candle window of each other
    const window = 3;
    const rsiRecentCross = rsiCrossedBelow70At.some(
      (idx) => idx >= i - window && idx <= i,
    );
    const macdRecentCross = macdCrossedBelowSignalAt.some(
      (idx) => idx >= i - window && idx <= i,
    );

    if (rsiRecentCross && macdRecentCross) {
      // Avoid emitting S1 repeatedly on consecutive candles for the same crossing pair
      const alreadyEmitted = signals.some(
        (s) => s.rule === 'S1' && (candle.timestamp - s.timestamp) / 1000 < window * 24 * 3600,
      );
      if (!alreadyEmitted) {
        signals.push({
          timestamp: candle.timestamp,
          type: 'STRONG_SELL',
          rule: 'S1',
          price: candle.close,
          description: 'Vânzare Puternică',
        });
      }
    }

    // ------- S4 -------
    // MACD crosses below 0 AND MACD line is below Signal line (trend confirmed bearish)
    const macdCrossesBelowZero = crossesBelow(macdLinePrev, macdLineCurr, 0);
    const alreadyS1OnThisCandle = signals.some(
      (s) => s.rule === 'S1' && s.timestamp === candle.timestamp,
    );
    if (
      macdCrossesBelowZero &&
      !alreadyS1OnThisCandle &&
      macdLineCurr !== null &&
      signalCurr !== null &&
      macdLineCurr < signalCurr
    ) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'SELL',
        rule: 'S4',
        price: candle.close,
        description: 'Vânzare — MACD trece sub zero',
      });
    }

    // ------- S2 -------
    // MACD line crosses below Signal line while RSI > 60 (macdCrossedBelowSignal computed above for S1)
    if (macdCrossedBelowSignal && rsiCurr !== null && rsiCurr > 60) {
      signals.push({
        timestamp: candle.timestamp,
        type: 'WARNING',
        rule: 'S2',
        price: candle.close,
        description: 'Avertisment Timpuriu de Vânzare',
      });
    }

    // ------- S3 -------
    // Close crosses below 20-day EMA AND 2+ consecutive down candles preceding this candle
    if (i >= 3) {
      const emaCurr = ema20[i];
      const emaPrev = ema20[i - 1];

      const priceCrossesBelowEMA = crossesBelowValue(
        ohlcv[i - 1].close,
        candle.close,
        emaPrev,
        emaCurr,
      );

      if (priceCrossesBelowEMA) {
        // "2+ consecutive down candles" means close < open for two bars before the crossover
        // bar N-1: candle at i-1 is down
        // bar N-2: candle at i-2 is down
        const bar1Down = ohlcv[i - 1].close < ohlcv[i - 1].open;
        const bar2Down = ohlcv[i - 2].close < ohlcv[i - 2].open;

        if (bar1Down && bar2Down) {
          signals.push({
            timestamp: candle.timestamp,
            type: 'SELL',
            rule: 'S3',
            price: candle.close,
            description: 'Vânzare pe Trend',
          });
        }
      }
    }
  }

  return signals;
}
