import type { SignalType } from '@/types/signals';

interface SignalBadgeProps {
  type: SignalType;
  rule: string;
  pulse?: boolean;
}

const SIGNAL_CONFIG: Record<SignalType, { bg: string; text: string; label: string }> = {
  STRONG_BUY: { bg: 'bg-strong-buy', text: 'text-white', label: 'CUMP. PUTERNICĂ' },
  BUY: { bg: 'bg-gain', text: 'text-white', label: 'CUMPĂRARE' },
  SELL: { bg: 'bg-loss', text: 'text-white', label: 'VÂNZARE' },
  STRONG_SELL: { bg: 'bg-strong-sell', text: 'text-white', label: 'VÂNZ. PUTERNICĂ' },
  WARNING: { bg: 'bg-warning', text: 'text-black', label: 'AVERTISMENT' },
};

export default function SignalBadge({ type, rule, pulse = false }: SignalBadgeProps) {
  const config = SIGNAL_CONFIG[type];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold
        ${config.bg} ${config.text}
        ${pulse ? 'signal-pulse' : ''}
      `}
    >
      {type === 'STRONG_BUY' || type === 'BUY' ? '▲' : type === 'WARNING' ? '◆' : '▼'}
      {config.label}
      <span className="opacity-70">({rule})</span>
    </span>
  );
}
