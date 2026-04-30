export type SignalType = 'STRONG_BUY' | 'BUY' | 'SELL' | 'STRONG_SELL' | 'WARNING';

export interface SignalEvent {
  timestamp: number;
  type: SignalType;
  rule: 'B1' | 'B2' | 'B3' | 'B4' | 'S1' | 'S2' | 'S3';
  price: number;
  description: string;
}
