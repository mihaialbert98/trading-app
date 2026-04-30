export interface RSIResult {
  values: (number | null)[];
}

export interface MACDResult {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
}

export interface BollingerResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

export interface EMAResult {
  values: (number | null)[];
  period: number;
}

export interface SMAResult {
  values: (number | null)[];
  period: number;
}

export interface StochasticResult {
  k: (number | null)[];
  d: (number | null)[];
}

export interface ATRResult {
  values: (number | null)[];
}

export interface VolumeResult {
  volumes: number[];
  avgVolume: (number | null)[];
}

export type IndicatorType =
  | 'RSI'
  | 'MACD'
  | 'BOLLINGER'
  | 'EMA'
  | 'SMA'
  | 'STOCHASTIC'
  | 'ATR'
  | 'VOLUME';

export interface IndicatorParams {
  rsiPeriod?: number;
  macdFast?: number;
  macdSlow?: number;
  macdSignal?: number;
  bollingerPeriod?: number;
  bollingerStdDev?: number;
  emaPeriods?: number[];
  smaPeriods?: number[];
  stochasticK?: number;
  stochasticD?: number;
  stochasticSmooth?: number;
  atrPeriod?: number;
  volumeAvgPeriod?: number;
}
