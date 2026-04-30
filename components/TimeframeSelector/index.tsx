'use client';

import { useStore } from '@/store';
import type { Timeframe, Interval } from '@/store';

const TIMEFRAMES: { label: string; tf: Timeframe; interval: Interval }[] = [
  { label: '1D', tf: '1d', interval: '1d' },
  { label: '5D', tf: '5d', interval: '1d' },
  { label: '1M', tf: '1mo', interval: '1d' },
  { label: '3M', tf: '3mo', interval: '1d' },
  { label: '6M', tf: '6mo', interval: '1d' },
  { label: '1Y', tf: '1y', interval: '1wk' },
  { label: '5Y', tf: '5y', interval: '1mo' },
];

export default function TimeframeSelector() {
  const { timeframe, setTimeframe } = useStore();

  return (
    <div className="flex items-center gap-1">
      {TIMEFRAMES.map(({ label, tf, interval }) => (
        <button
          key={tf}
          onClick={() => setTimeframe(tf, interval)}
          className={`
            px-3 py-1.5 rounded text-xs font-mono font-medium tracking-wide
            transition-colors
            ${
              timeframe === tf
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary hover:bg-panel-hover'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
