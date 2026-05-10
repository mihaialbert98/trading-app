'use client';

import { useStore } from '@/store';
import type { Timeframe, Interval } from '@/store';

interface TFEntry {
  label: string;
  tf: Timeframe;
  interval: Interval;
  viewDays?: number;
}

const TIMEFRAMES: TFEntry[] = [
  { label: '1H',  tf: '5d',   interval: '1h',  viewDays: 7   },
  { label: '4H',  tf: '1mo',  interval: '4h',  viewDays: 30  },
  { label: '1D',  tf: '5d',   interval: '1h',  viewDays: 1   },
  { label: '5D',  tf: '5d',   interval: '1h'                  },
  { label: '1M',  tf: '1mo',  interval: '1d'                  },
  { label: '3M',  tf: '3mo',  interval: '1d'                  },
  { label: '6M',  tf: '6mo',  interval: '1d'                  },
  { label: '1Y',  tf: '1y',   interval: '1wk'                 },
  { label: '5Y',  tf: '5y',   interval: '1mo'                 },
];

export default function TimeframeSelector() {
  const { interval, viewDays, setTimeframe } = useStore();

  // Active button: match on both interval and viewDays
  function isActive(entry: TFEntry) {
    return interval === entry.interval && (entry.viewDays ?? null) === viewDays;
  }

  return (
    <div className="flex items-center gap-1">
      {TIMEFRAMES.map((entry) => (
        <button
          key={entry.label}
          onClick={() => setTimeframe(entry.tf, entry.interval, entry.viewDays)}
          className={`
            px-3 py-1.5 rounded text-xs font-mono font-medium tracking-wide
            transition-colors
            ${
              isActive(entry)
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary hover:bg-panel-hover'
            }
          `}
        >
          {entry.label}
        </button>
      ))}
    </div>
  );
}
