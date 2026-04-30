import YahooFinanceClass from 'yahoo-finance2';
import type { SearchResult, Quote, OHLCV, CompanyInfo, NewsItem } from '@/types/stock';

// Single shared Yahoo Finance instance for the process lifetime
const yf = new YahooFinanceClass();

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// TTL constants (milliseconds)
const TTL_SEARCH = 5 * 60 * 1000;       // 5 minutes
const TTL_QUOTE = 30 * 1000;             // 30 seconds
const TTL_HISTORY = 5 * 60 * 1000;      // 5 minutes
const TTL_FUNDAMENTALS = 60 * 60 * 1000; // 1 hour
const TTL_NEWS = 5 * 60 * 1000;         // 5 minutes

// ---------------------------------------------------------------------------
// Sentiment helper
// ---------------------------------------------------------------------------

const POSITIVE_KEYWORDS = ['bullish', 'surge', 'beat', 'rally', 'up', 'gain', 'rise', 'soar', 'record', 'profit'];
const NEGATIVE_KEYWORDS = ['bearish', 'drop', 'miss', 'fall', 'down', 'crash', 'loss', 'decline', 'warn', 'cut'];

function detectSentiment(title: string): NewsItem['sentiment'] {
  const lower = title.toLowerCase();
  const posMatches = POSITIVE_KEYWORDS.filter((w) => lower.includes(w)).length;
  const negMatches = NEGATIVE_KEYWORDS.filter((w) => lower.includes(w)).length;

  if (posMatches > negMatches) return 'POSITIVE';
  if (negMatches > posMatches) return 'NEGATIVE';
  return 'NEUTRAL';
}

// ---------------------------------------------------------------------------
// Range → period1/period2 mapping
// ---------------------------------------------------------------------------

type Range = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y';

function rangeToPeriod(range: Range): { period1: Date; period2: Date } {
  const now = new Date();
  const period2 = new Date(now);
  const period1 = new Date(now);

  switch (range) {
    case '1d':
      period1.setDate(period1.getDate() - 1);
      break;
    case '5d':
      period1.setDate(period1.getDate() - 5);
      break;
    case '1mo':
      period1.setMonth(period1.getMonth() - 1);
      break;
    case '3mo':
      period1.setMonth(period1.getMonth() - 3);
      break;
    case '6mo':
      period1.setMonth(period1.getMonth() - 6);
      break;
    case '1y':
      period1.setFullYear(period1.getFullYear() - 1);
      break;
    case '5y':
      period1.setFullYear(period1.getFullYear() - 5);
      break;
  }

  return { period1, period2 };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function searchTickers(query: string): Promise<SearchResult[]> {
  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = getCached<SearchResult[]>(cacheKey);
  if (cached) return cached;

  const result = await yf.search(query, { quotesCount: 10, newsCount: 0 });

  // Only keep Yahoo Finance quotes (not Crunchbase non-Yahoo entries)
  const yahooQuotes = result.quotes.filter(
    (q): q is Exclude<typeof q, { isYahooFinance: false }> =>
      'isYahooFinance' in q && q.isYahooFinance === true,
  );

  const results: SearchResult[] = yahooQuotes.map((q) => {
    const name =
      ('longname' in q && typeof q.longname === 'string' ? q.longname : null) ??
      ('shortname' in q && typeof q.shortname === 'string' ? q.shortname : null) ??
      q.symbol;
    const type =
      ('quoteType' in q && typeof q.quoteType === 'string' ? q.quoteType : 'EQUITY');
    return {
      symbol: q.symbol,
      name,
      exchange: q.exchange ?? '',
      country: '', // Yahoo Finance search doesn't reliably return country
      type,
    } satisfies SearchResult;
  });

  setCached(cacheKey, results, TTL_SEARCH);
  return results;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const cacheKey = `quote:${symbol.toUpperCase()}`;
  const cached = getCached<Quote>(cacheKey);
  if (cached) return cached;

  const raw = await yf.quote(symbol);

  const quote: Quote = {
    symbol: raw.symbol,
    name: raw.longName ?? raw.shortName ?? raw.symbol,
    price: raw.regularMarketPrice ?? 0,
    change: raw.regularMarketChange ?? 0,
    changePercent: raw.regularMarketChangePercent ?? 0,
    marketCap: raw.marketCap ?? 0,
    currency: raw.currency ?? 'USD',
    exchange: raw.exchange ?? '',
  };

  setCached(cacheKey, quote, TTL_QUOTE);
  return quote;
}

export async function getHistory(
  symbol: string,
  interval: '1d' | '1wk' | '1mo',
  range: Range,
): Promise<OHLCV[]> {
  const cacheKey = `history:${symbol.toUpperCase()}:${interval}:${range}`;
  const cached = getCached<OHLCV[]>(cacheKey);
  if (cached) return cached;

  const { period1, period2 } = rangeToPeriod(range);

  const rows = await yf.historical(symbol, {
    period1,
    period2,
    interval,
    events: 'history',
    includeAdjustedClose: false,
  });

  const ohlcv: OHLCV[] = rows
    .map((row) => ({
      timestamp: row.date.getTime(),
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
      volume: row.volume,
    }))
    // Sort ascending by timestamp
    .sort((a, b) => a.timestamp - b.timestamp);

  setCached(cacheKey, ohlcv, TTL_HISTORY);
  return ohlcv;
}

export async function getFundamentals(symbol: string): Promise<CompanyInfo> {
  const cacheKey = `fundamentals:${symbol.toUpperCase()}`;
  const cached = getCached<CompanyInfo>(cacheKey);
  if (cached) return cached;

  const summary = await yf.quoteSummary(symbol, {
    modules: ['assetProfile', 'financialData', 'defaultKeyStatistics', 'summaryDetail', 'price'],
  });

  const profile = summary.assetProfile;
  const financial = summary.financialData;
  const keyStats = summary.defaultKeyStatistics;
  const detail = summary.summaryDetail;
  const price = summary.price;

  // Truncate description to ~120 words
  const rawDescription = profile?.longBusinessSummary ?? '';
  const descriptionWords = rawDescription.split(/\s+/);
  const description =
    descriptionWords.length > 120
      ? descriptionWords.slice(0, 120).join(' ') + '…'
      : rawDescription;

  const info: CompanyInfo = {
    symbol: symbol.toUpperCase(),
    name: price?.longName ?? price?.shortName ?? symbol.toUpperCase(),
    sector: profile?.sector ?? '',
    industry: profile?.industry ?? '',
    country: profile?.country ?? '',
    description,
    peRatio: detail?.trailingPE ?? keyStats?.forwardPE ?? null,
    eps: keyStats?.trailingEps ?? null,
    marketCap: detail?.marketCap ?? null,
    week52High: detail?.fiftyTwoWeekHigh ?? null,
    week52Low: detail?.fiftyTwoWeekLow ?? null,
    dividendYield:
      detail?.dividendYield != null ? detail.dividendYield * 100 : null,
    analystRating: financial?.recommendationMean ?? null,
    analystCount: financial?.numberOfAnalystOpinions ?? null,
  };

  setCached(cacheKey, info, TTL_FUNDAMENTALS);
  return info;
}

export async function getNews(symbol: string): Promise<NewsItem[]> {
  const cacheKey = `news:${symbol.toUpperCase()}`;
  const cached = getCached<NewsItem[]>(cacheKey);
  if (cached) return cached;

  const result = await yf.search(symbol, { quotesCount: 0, newsCount: 10 });

  const news: NewsItem[] = result.news.map((article) => {
    const thumbnailUrl =
      article.thumbnail?.resolutions?.[0]?.url ?? null;

    return {
      title: article.title,
      link: article.link,
      source: article.publisher,
      publishedAt: article.providerPublishTime instanceof Date
        ? article.providerPublishTime.getTime()
        : Number(article.providerPublishTime) * 1000,
      thumbnail: thumbnailUrl,
      sentiment: detectSentiment(article.title),
    };
  });

  setCached(cacheKey, news, TTL_NEWS);
  return news;
}
