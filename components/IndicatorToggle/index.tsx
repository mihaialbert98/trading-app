'use client';

import { useStore } from '@/store';
import { useT } from '@/lib/i18n';
import type { IndicatorType } from '@/types/indicators';

const INDICATORS: { key: IndicatorType; label: string }[] = [
  { key: 'RSI', label: 'RSI' },
  { key: 'MACD', label: 'MACD' },
  { key: 'BOLLINGER', label: 'BB' },
  { key: 'EMA', label: 'EMA' },
  { key: 'SMA', label: 'SMA' },
  { key: 'VOLUME', label: 'VOL' },
  { key: 'STOCHASTIC', label: 'STOCH' },
  { key: 'ATR', label: 'ATR' },
];

export default function IndicatorToggle() {
  const { activeIndicators, toggleIndicator } = useStore();
  const tr = useT();

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-text-dim text-xs font-sans mr-1">{tr('indicatorsLabel')}</span>
      {INDICATORS.map(({ key, label }) => {
        const active = activeIndicators.includes(key);
        return (
          <button
            key={key}
            onClick={() => toggleIndicator(key)}
            className={`
              px-2.5 py-1 rounded text-xs font-mono font-medium tracking-wide
              border transition-colors
              ${
                active
                  ? 'bg-accent border-accent text-white'
                  : 'bg-transparent border-border-subtle text-text-muted hover:border-accent hover:text-accent'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
