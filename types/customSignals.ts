export type CustomIndicatorSource =
  | 'RSI'
  | 'MACD_LINE'
  | 'MACD_SIGNAL'
  | 'MACD_HISTOGRAM'
  | 'PRICE'
  | 'BOLLINGER_UPPER'
  | 'BOLLINGER_MIDDLE'
  | 'BOLLINGER_LOWER'
  | 'EMA_9'
  | 'EMA_21'
  | 'EMA_50'
  | 'EMA_200'
  | 'SMA_50'
  | 'SMA_200'
  | 'VOLUME';

export type CustomConditionOperator =
  | 'CROSSES_ABOVE'
  | 'CROSSES_BELOW'
  | 'IS_ABOVE'
  | 'IS_BELOW';

export type CustomRhsType = 'VALUE' | 'INDICATOR';

export interface CustomCondition {
  lhs: CustomIndicatorSource;
  operator: CustomConditionOperator;
  rhsType: CustomRhsType;
  rhsValue?: number;          // used when rhsType === 'VALUE'
  rhsIndicator?: CustomIndicatorSource; // used when rhsType === 'INDICATOR'
}

export type CustomSignalOutputType = 'BUY' | 'SELL' | 'WARNING';

export interface CustomRule {
  id: string;
  name: string;
  outputType: CustomSignalOutputType;
  conditions: CustomCondition[]; // all conditions ANDed together
  enabled: boolean;
}
