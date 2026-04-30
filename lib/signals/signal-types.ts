export type { SignalType, SignalEvent } from '@/types/signals';

import type { OHLCV } from '@/types/stock';
import type { MACDResult, BollingerResult } from '@/types/indicators';

export interface SignalContext {
  ohlcv: OHLCV[];
  rsi: (number | null)[];
  macd: MACDResult;
  bollinger: BollingerResult;
  ema20: (number | null)[];
}
