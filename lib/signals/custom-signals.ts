import type { OHLCV } from '@/types/stock';
import type { SignalEvent } from '@/types/signals';
import type {
  MACDResult,
  BollingerResult,
  EMAResult,
  SMAResult,
  VolumeResult,
} from '@/types/indicators';
import type {
  CustomRule,
  CustomIndicatorSource,
  CustomConditionOperator,
} from '@/types/customSignals';
import { crossesAboveValue, crossesBelowValue } from '@/lib/utils/crossover';

interface CustomSignalContext {
  ohlcv: OHLCV[];
  rsi: (number | null)[];
  macd: MACDResult;
  bollinger: BollingerResult;
  ema: EMAResult[];
  sma: SMAResult[];
  volume: VolumeResult | null;
}

function getSeriesValues(
  source: CustomIndicatorSource,
  ctx: CustomSignalContext,
): (number | null)[] {
  const { ohlcv, rsi, macd, bollinger, ema, sma, volume } = ctx;
  switch (source) {
    case 'RSI': return rsi;
    case 'MACD_LINE': return macd.macd;
    case 'MACD_SIGNAL': return macd.signal;
    case 'MACD_HISTOGRAM': return macd.histogram;
    case 'PRICE': return ohlcv.map((c) => c.close);
    case 'BOLLINGER_UPPER': return bollinger.upper;
    case 'BOLLINGER_MIDDLE': return bollinger.middle;
    case 'BOLLINGER_LOWER': return bollinger.lower;
    case 'EMA_9': return ema.find((e) => e.period === 9)?.values ?? ohlcv.map(() => null);
    case 'EMA_21': return ema.find((e) => e.period === 21)?.values ?? ohlcv.map(() => null);
    case 'EMA_50': return ema.find((e) => e.period === 50)?.values ?? ohlcv.map(() => null);
    case 'EMA_200': return ema.find((e) => e.period === 200)?.values ?? ohlcv.map(() => null);
    case 'SMA_50': return sma.find((s) => s.period === 50)?.values ?? ohlcv.map(() => null);
    case 'SMA_200': return sma.find((s) => s.period === 200)?.values ?? ohlcv.map(() => null);
    case 'VOLUME': return volume ? volume.volumes.map((v) => v) : ohlcv.map(() => null);
  }
}

function evalCondition(
  operator: CustomConditionOperator,
  prevLhs: number | null,
  currLhs: number | null,
  prevRhs: number | null,
  currRhs: number | null,
): boolean {
  if (prevLhs === null || currLhs === null || prevRhs === null || currRhs === null) return false;
  switch (operator) {
    case 'CROSSES_ABOVE': return crossesAboveValue(prevLhs, currLhs, prevRhs, currRhs);
    case 'CROSSES_BELOW': return crossesBelowValue(prevLhs, currLhs, prevRhs, currRhs);
    case 'IS_ABOVE': return currLhs > currRhs;
    case 'IS_BELOW': return currLhs < currRhs;
  }
}

export function evaluateCustomRules(
  rules: CustomRule[],
  ctx: CustomSignalContext,
): SignalEvent[] {
  const { ohlcv } = ctx;
  const signals: SignalEvent[] = [];

  for (const rule of rules) {
    if (!rule.enabled || rule.conditions.length === 0) continue;

    // Pre-resolve all series needed by this rule
    const resolvedSeries: Array<{
      lhsSeries: (number | null)[];
      rhsSeries: (number | null)[];
    }> = rule.conditions.map((cond) => {
      const lhsSeries = getSeriesValues(cond.lhs, ctx);
      let rhsSeries: (number | null)[];
      if (cond.rhsType === 'VALUE') {
        const val = cond.rhsValue ?? 0;
        rhsSeries = ohlcv.map(() => val);
      } else {
        rhsSeries = getSeriesValues(cond.rhsIndicator!, ctx);
      }
      return { lhsSeries, rhsSeries };
    });

    for (let i = 1; i < ohlcv.length; i++) {
      const allMet = rule.conditions.every((cond, ci) => {
        const { lhsSeries, rhsSeries } = resolvedSeries[ci];
        return evalCondition(
          cond.operator,
          lhsSeries[i - 1],
          lhsSeries[i],
          rhsSeries[i - 1],
          rhsSeries[i],
        );
      });

      if (allMet) {
        // Avoid duplicate on the same candle for the same rule
        const alreadyEmitted = signals.some(
          (s) => s.rule === ('C:' + rule.id as never) && s.timestamp === ohlcv[i].timestamp,
        );
        if (!alreadyEmitted) {
          signals.push({
            timestamp: ohlcv[i].timestamp,
            type: rule.outputType === 'BUY' ? 'BUY' : rule.outputType === 'SELL' ? 'SELL' : 'WARNING',
            rule: `C:${rule.id}` as never,
            price: ohlcv[i].close,
            description: rule.name,
          });
        }
      }
    }
  }

  return signals;
}
