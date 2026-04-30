'use client';

import { useStore } from '@/store';
import { useQuote } from '@/hooks/useStockData';

interface WatchlistRowProps {
  symbol: string;
  name: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function WatchlistRow({ symbol, name, isSelected, onSelect, onRemove }: WatchlistRowProps) {
  const { quote } = useQuote(symbol);

  const priceStr =
    quote !== null
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: quote.currency || 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(quote.price)
      : null;

  const changePositive = quote !== null && quote.changePercent >= 0;
  const changeStr =
    quote !== null
      ? `${changePositive ? '+' : ''}${new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(quote.changePercent)}%`
      : null;

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-lg
        transition-colors border
        ${
          isSelected
            ? 'bg-accent/10 border-accent/40'
            : 'bg-transparent border-transparent hover:bg-panel-hover'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono font-bold text-sm text-accent tracking-wide">{symbol}</span>
          {priceStr && (
            <span className="font-mono text-xs text-text-primary tabular-nums">{priceStr}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="text-xs font-sans text-text-muted truncate">{name}</span>
          {changeStr && (
            <span
              className={`font-mono text-[11px] tabular-nums shrink-0 ${
                changePositive ? 'text-gain' : 'text-loss'
              }`}
            >
              {changeStr}
            </span>
          )}
        </div>
      </div>
      <button
        className="shrink-0 text-text-dim hover:text-loss transition-colors p-1 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Elimină ${symbol} din lista de urmărire`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 2l8 8M10 2L2 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default function Watchlist() {
  const { watchlist, selectedSymbol, setSelectedSymbol, removeFromWatchlist } = useStore();

  return (
    <div className="bg-panel border border-border-subtle rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <h2 className="text-sm font-sans font-semibold text-text-primary tracking-wide uppercase">
          Watchlist
        </h2>
        {watchlist.length > 0 && (
          <span className="text-xs font-mono text-text-muted">{watchlist.length}</span>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="px-4 py-5 text-center">
          <p className="text-text-muted text-xs font-sans leading-relaxed">
            Caută o acțiune și adaug-o la lista de urmărire
          </p>
        </div>
      ) : (
        <div className="p-2 space-y-0.5">
          {watchlist.map((item) => (
            <WatchlistRow
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
              isSelected={selectedSymbol === item.symbol}
              onSelect={() => setSelectedSymbol(item.symbol, item.name)}
              onRemove={() => removeFromWatchlist(item.symbol)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
