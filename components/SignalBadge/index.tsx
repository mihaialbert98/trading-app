'use client';

import { useT } from '@/lib/i18n';
import type { SignalType } from '@/types/signals';

interface SignalBadgeProps {
  type: SignalType;
  rule: string;
  pulse?: boolean;
}

const SIGNAL_STYLE: Record<SignalType, { bg: string; text: string }> = {
  STRONG_BUY: { bg: 'bg-strong-buy', text: 'text-white' },
  BUY: { bg: 'bg-gain', text: 'text-white' },
  SELL: { bg: 'bg-loss', text: 'text-white' },
  STRONG_SELL: { bg: 'bg-strong-sell', text: 'text-white' },
  WARNING: { bg: 'bg-warning', text: 'text-black' },
};

export default function SignalBadge({ type, rule, pulse = false }: SignalBadgeProps) {
  const tr = useT();
  const style = SIGNAL_STYLE[type];

  const label =
    type === 'STRONG_BUY'
      ? tr('strongBuy')
      : type === 'BUY'
      ? tr('buy')
      : type === 'SELL'
      ? tr('sell')
      : type === 'STRONG_SELL'
      ? tr('strongSell')
      : tr('warning');

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold
        ${style.bg} ${style.text}
        ${pulse ? 'signal-pulse' : ''}
      `}
    >
      {type === 'STRONG_BUY' || type === 'BUY' ? '▲' : type === 'WARNING' ? '◆' : '▼'}
      {label}
      <span className="opacity-70">({rule})</span>
    </span>
  );
}
