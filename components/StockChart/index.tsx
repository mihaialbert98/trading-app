'use client';

import dynamic from 'next/dynamic';
import { useStore } from '@/store';
import { useStockData, useQuote } from '@/hooks/useStockData';
import { useIndicators } from '@/hooks/useIndicators';

const ChartCore = dynamic(() => import('./ChartCore'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

function ChartSkeleton() {
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
        <span className="text-text-dim text-xs font-mono">Se încarcă graficul…</span>
      </div>
    </div>
  );
}

function EmptyState() {
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
          <p className="text-text-muted font-sans font-semibold text-sm">Nicio acțiune selectată</p>
          <p className="text-text-dim font-sans text-xs mt-1 leading-relaxed">
            Caută un simbol bursier în bara laterală pentru a încărca graficul
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-3 max-w-xs text-center">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="16" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M18 11v9M18 24v1.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-loss font-sans text-sm font-semibold">Eroare la încărcarea graficului</p>
          <p className="text-text-dim font-sans text-xs mt-1">{message}</p>
        </div>
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

export default function StockChart() {
  const { selectedSymbol, activeIndicators, interval, timeframe } = useStore();
  const { data: ohlcv, signals, isLoading, error } = useStockData(
    selectedSymbol,
    interval,
    timeframe
  );
  const { indicators } = useIndicators(selectedSymbol);

  return (
    <div className="flex flex-col h-full border border-border-subtle rounded-lg overflow-hidden bg-navy">
      <QuoteBar />

      <div className="flex-1 min-h-0 relative">
        {!selectedSymbol && <EmptyState />}

        {selectedSymbol && isLoading && <ChartSkeleton />}

        {selectedSymbol && !isLoading && error && (
          <ErrorState message={error.message} />
        )}

        {selectedSymbol && !isLoading && !error && ohlcv && ohlcv.length > 0 && (
          <ChartCore
            ohlcv={ohlcv}
            signals={signals}
            indicators={indicators}
            activeIndicators={activeIndicators}
          />
        )}

        {selectedSymbol && !isLoading && !error && (!ohlcv || ohlcv.length === 0) && (
          <div className="w-full h-full flex items-center justify-center bg-navy">
            <p className="text-text-muted font-sans text-sm">Nu există date disponibile</p>
          </div>
        )}
      </div>
    </div>
  );
}
