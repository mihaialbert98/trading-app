export type SignalType = 'STRONG_BUY' | 'BUY' | 'SELL' | 'STRONG_SELL' | 'WARNING';

export type BuiltinRule = 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'S1' | 'S2' | 'S3' | 'S4';

export interface SignalEvent {
  timestamp: number;
  type: SignalType;
  rule: BuiltinRule | `C:${string}`;
  price: number;
  description: string;
}
