'use client';

import dynamic from 'next/dynamic';
import { useStore } from '@/store';
import { useStockData, useQuote } from '@/hooks/useStockData';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useT } from '@/lib/i18n';
import type { OHLCV } from '@/types/stock';
import { calculateRSI } from '@/lib/indicators/rsi';
import { calculateMACD } from '@/lib/indicators/macd';
import { calculateBollinger } from '@/lib/indicators/bollinger';
import { calculateEMA } from '@/lib/indicators/ema';
import { calculateSMA } from '@/lib/indicators/sma';
import { calculateStochastic } from '@/lib/indicators/stochastic';
import { calculateATR } from '@/lib/indicators/atr';
import { calculateVolume } from '@/lib/indicators/volume';

const ChartCore = dynamic(() => import('./ChartCore'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

function ChartSkeleton() {
  const tr = useT();
  return (
    <div className="w-full h-full flex items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1 items-end">
          {[20, 45, 30, 60, 40, 55, 35, 50].map((h, i) => (
            <div
              key={i}
              className="skeleton w-5 rounded-sm"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <span className="text-text-dim text-xs font-mono">{tr('loadingChart')}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  const tr = useT();
  return (
    <div className="w-full h-full flex items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-4 max-w-xs text-center">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
          <rect width="56" height="56" rx="12" fill="#1e293b" />
          <path
            d="M12 38l10-12 8 8 10-16 8 10"
            stroke="#334155"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <p className="text-text-muted font-sans font-semibold text-sm">{tr('noStockSelected')}</p>
          <p className="text-text-dim font-sans text-xs mt-1 leading-relaxed">
            {tr('searchSidebarHint')}
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const tr = useT();
  return (
    <div className="w-full h-full flex items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-3 max-w-xs text-center">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="16" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M18 11v9M18 24v1.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-loss font-sans text-sm font-semibold">{tr('chartError')}</p>
          <p className="text-text-dim font-sans text-xs mt-1">{message}</p>
        </div>
        <button
          onClick={onRetry}
          className="mt-1 px-3 py-1.5 text-xs font-sans border border-border-subtle text-text-muted rounded hover:text-text-primary hover:border-accent transition-colors"
        >
          {tr('locale') === 'ro' ? 'Încearcă din nou' : 'Try again'}
        </button>
      </div>
    </div>
  );
}

function QuoteBar() {
  const selectedSymbol = useStore((s) => s.selectedSymbol);
  const selectedName = useStore((s) => s.selectedName);
  const { addToWatchlist, watchlist } = useStore();
  const { quote } = useQuote(selectedSymbol);

  if (!selectedSymbol) return null;

  const isWatched = watchlist.some((w) => w.symbol === selectedSymbol);
  const isPositive = quote !== null && quote.changePercent >= 0;

  const priceStr = quote
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: quote.currency || 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(quote.price)
    : null;

  const changeStr = quote
    ? `${isPositive ? '+' : ''}${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(quote.changePercent)}%`
    : null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-panel shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono font-bold text-accent text-base tracking-wide">
          {selectedSymbol}
        </span>
        {selectedName && (
          <span className="font-sans text-text-muted text-sm truncate hidden sm:block max-w-[200px]">
            {selectedName}
          </span>
        )}
        {quote?.exchange && (
          <span className="text-[11px] font-sans px-1.5 py-0.5 rounded bg-border-subtle text-text-dim hidden md:block">
            {quote.exchange}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {priceStr && (
          <span className="font-mono font-semibold text-text-primary text-sm tabular-nums">
            {priceStr}
          </span>
        )}
        {changeStr && (
          <span
            className={`font-mono text-xs tabular-nums font-medium ${
              isPositive ? 'text-gain' : 'text-loss'
            }`}
          >
            {changeStr}
          </span>
        )}

        {!isWatched && (
          <button
            className="
              flex items-center gap-1.5 px-2.5 py-1 rounded
              border border-border-subtle text-text-muted
              hover:border-accent hover:text-accent
              text-xs font-sans transition-colors
            "
            onClick={() =>
              addToWatchlist(selectedSymbol, selectedName ?? selectedSymbol)
            }
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M5 1v8M1 5h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Watch
          </button>
        )}
        {isWatched && (
          <span className="text-xs font-sans text-accent flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M1.5 5l2.5 2.5 4.5-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Watching
          </span>
        )}
      </div>
    </div>
  );
}

// How far back one scroll-back step reaches (in days per interval type)
const SCROLL_BACK_DAYS: Record<string, number> = {
  '1h': 30,
  '1d': 365,
  '1wk': 365 * 3,
  '1mo': 365 * 10,
};

export default function StockChart() {
  const tr = useT();
  const { selectedSymbol, activeIndicators, interval, timeframe, selectedSignalTimestamp } = useStore();
  const { data: freshOhlcv, indicators: rawIndicators, signals, isLoading, error, mutate, fetchHistoryChunk } = useStockData(
    selectedSymbol,
    interval,
    timeframe
  );

  const { emaPeriods, smaPeriods } = useStore();

  // Accumulated historical data (prepended chunks from scroll-back)
  const [prependedOhlcv, setPrependedOhlcv] = useState<OHLCV[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Prevent re-fetching the same window
  const oldestFetchedRef = useRef<number | null>(null);

  // Reset prepended data whenever symbol/timeframe/interval changes
  const currentKey = `${selectedSymbol}:${interval}:${timeframe}`;
  const prevKeyRef = useRef(currentKey);
  useEffect(() => {
    if (currentKey !== prevKeyRef.current) {
      prevKeyRef.current = currentKey;
      setPrependedOhlcv([]);
      setIsLoadingMore(false);
      oldestFetchedRef.current = null;
    }
  }, [currentKey]);

  // Merge prepended + fresh, deduplicating by timestamp.
  // If the key changed but the effect hasn't fired yet, skip merging old prepended data.
  const ohlcv: OHLCV[] | null = (() => {
    if (!freshOhlcv) return null;
    if (prependedOhlcv.length === 0 || currentKey !== prevKeyRef.current) return freshOhlcv;
    const seen = new Set(freshOhlcv.map((d) => d.timestamp));
    const unique = prependedOhlcv.filter((d) => !seen.has(d.timestamp));
    return [...unique, ...freshOhlcv].sort((a, b) => a.timestamp - b.timestamp);
  })();

  // When prepended history exists, recompute all indicators over the full merged ohlcv
  // so the sub-panels cover the scrolled-back range too.
  // Otherwise use the server-computed values (no client work needed).
  const indicators = useMemo(() => {
    if (!rawIndicators || !ohlcv) return {};

    const src = ohlcv;
    const useClientComputed = prependedOhlcv.length > 0;

    const rsiValues = useClientComputed ? calculateRSI(src, 14) : (rawIndicators.rsi?.values ?? []);
    const macdResult = useClientComputed ? calculateMACD(src, 12, 26, 9) : rawIndicators.macd;
    const bollingerResult = useClientComputed ? calculateBollinger(src, 20, 2) : rawIndicators.bollinger;
    const atrResult = useClientComputed ? calculateATR(src, 14) : rawIndicators.atr;
    const volumeResult = useClientComputed ? calculateVolume(src, 20) : rawIndicators.volume;
    const stochasticResult = useClientComputed ? calculateStochastic(src, 14, 3, 3) : rawIndicators.stochastic;

    const out: Record<string, unknown> = {};
    if (activeIndicators.includes('RSI')) out.rsi = { values: rsiValues };
    if (activeIndicators.includes('MACD')) out.macd = macdResult;
    if (activeIndicators.includes('BOLLINGER')) out.bollinger = bollingerResult;
    if (activeIndicators.includes('STOCHASTIC')) out.stochastic = stochasticResult;
    if (activeIndicators.includes('ATR')) out.atr = atrResult;
    if (activeIndicators.includes('VOLUME')) out.volume = volumeResult;
    if (activeIndicators.includes('EMA')) {
      out.ema = emaPeriods.map((p) => ({
        period: p,
        values: useClientComputed ? calculateEMA(src, p) : (rawIndicators.ema?.[p] ?? []),
      }));
    }
    if (activeIndicators.includes('SMA')) {
      out.sma = smaPeriods.map((p) => ({
        period: p,
        values: useClientComputed ? calculateSMA(src, p) : (rawIndicators.sma?.[p] ?? []),
      }));
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawIndicators, ohlcv, prependedOhlcv.length, activeIndicators, emaPeriods, smaPeriods]);

  const handleScrollBackRequest = useCallback(async (oldestTimestamp: number) => {
    if (isLoadingMore || !selectedSymbol) return;
    // Don't re-fetch if we already fetched this far back
    if (oldestFetchedRef.current !== null && oldestTimestamp >= oldestFetchedRef.current) return;

    const days = SCROLL_BACK_DAYS[interval] ?? 365;
    const period1 = new Date(oldestTimestamp - days * 24 * 60 * 60 * 1000);

    // Don't go before ~1990 (no data that far back anyway)
    if (period1.getFullYear() < 1990) return;

    setIsLoadingMore(true);
    oldestFetchedRef.current = oldestTimestamp;

    const chunk = await fetchHistoryChunk(period1);
    if (chunk && chunk.length > 0) {
      setPrependedOhlcv((prev) => {
        const seen = new Set(prev.map((d) => d.timestamp));
        const newItems = chunk.filter((d) => !seen.has(d.timestamp));
        return [...newItems, ...prev].sort((a, b) => a.timestamp - b.timestamp);
      });
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, selectedSymbol, interval, fetchHistoryChunk]);

  return (
    <div className="flex flex-col h-full border border-border-subtle rounded-lg overflow-hidden bg-navy">
      <QuoteBar />

      <div className="flex-1 min-h-0 relative">
        {!selectedSymbol && <EmptyState />}

        {selectedSymbol && isLoading && <ChartSkeleton />}

        {selectedSymbol && !isLoading && error && (
          <ErrorState message={error.message} onRetry={() => mutate()} />
        )}

        {selectedSymbol && !isLoading && !error && ohlcv && ohlcv.length > 0 && (
          <ChartCore
            ohlcv={ohlcv}
            viewportOhlcv={freshOhlcv ?? []}
            signals={signals}
            indicators={indicators}
            activeIndicators={activeIndicators}
            selectedSignalTimestamp={selectedSignalTimestamp}
            onScrollBackRequest={handleScrollBackRequest}
            isLoadingMore={isLoadingMore}
          />
        )}

        {selectedSymbol && !isLoading && !error && (!ohlcv || ohlcv.length === 0) && (
          <div className="w-full h-full flex items-center justify-center bg-navy">
            <p className="text-text-muted font-sans text-sm">{tr('noChartData')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
