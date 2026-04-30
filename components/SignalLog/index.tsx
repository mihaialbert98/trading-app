'use client';

import { useStore } from '@/store';
import { useSignals } from '@/hooks/useSignals';
import { useT, signalDescriptions } from '@/lib/i18n';
import SignalBadge from '@/components/SignalBadge';
import Widget from '@/components/Widget';

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatTime(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(ts));
}

export default function SignalLog() {
  const selectedSymbol = useStore((s) => s.selectedSymbol);
  const locale = useStore((s) => s.locale);
  const selectedSignalTimestamp = useStore((s) => s.selectedSignalTimestamp);
  const setSelectedSignalTimestamp = useStore((s) => s.setSelectedSignalTimestamp);
  const { signals, isLoading, error } = useSignals(selectedSymbol);
  const tr = useT();

  const badge = signals.length > 0 ? `${signals.length} ${tr('signalUnit')}` : undefined;

  return (
    <Widget id="signals" title={tr('signalLogTitle')} badge={badge} tourAttr="signal-log">
      {!selectedSymbol && (
        <div className="px-4 py-6 text-center text-text-muted text-sm font-sans">
          {tr('selectStockSignals')}
        </div>
      )}

      {selectedSymbol && isLoading && (
        <div className="p-4 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-10 rounded" />
          ))}
        </div>
      )}

      {selectedSymbol && error && (
        <div className="px-4 py-4 text-center text-loss text-sm font-sans">
          {tr('signalError')}
        </div>
      )}

      {selectedSymbol && !isLoading && !error && signals.length === 0 && (
        <div className="px-4 py-6 text-center text-text-muted text-sm font-sans">
          {tr('noSignals')}
        </div>
      )}

      {signals.map((signal, idx) => {
        const description =
          signalDescriptions[signal.rule]?.[locale] ?? signal.description;
        const isSelected = selectedSignalTimestamp === signal.timestamp;
        return (
          <div
            key={`${signal.timestamp}-${signal.rule}`}
            onClick={() => setSelectedSignalTimestamp(isSelected ? null : signal.timestamp)}
            className={`
              flex flex-col gap-1.5 px-4 py-3 border-b border-border-subtle last:border-0
              hover:bg-panel-hover transition-colors cursor-pointer
              ${isSelected ? 'bg-accent/10 border-l-2 border-l-accent' : idx === 0 ? 'bg-panel-hover/40' : ''}
            `}
          >
            <div className="flex items-center justify-between gap-2">
              <SignalBadge type={signal.type} rule={signal.rule} pulse={idx === 0} />
              <span className="font-mono text-xs text-text-muted tabular-nums">
                {fmt.format(signal.price)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-text-muted font-sans leading-tight">
                {description}
              </span>
              <span className="text-xs font-mono text-text-dim tabular-nums shrink-0">
                {formatTime(signal.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </Widget>
  );
}
