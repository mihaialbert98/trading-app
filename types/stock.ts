export interface OHLCV {
  timestamp: number; // Unix ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  currency: string;
  exchange: string;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  country: string;
  description: string;
  peRatio: number | null;
  eps: number | null;
  marketCap: number | null;
  week52High: number | null;
  week52Low: number | null;
  dividendYield: number | null;
  analystRating: number | null; // recommendationMean: 1=Strong Buy, 5=Strong Sell
  analystCount: number | null;
}

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAt: number; // Unix ms
  thumbnail: string | null;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  country: string;
  type: string;
}
