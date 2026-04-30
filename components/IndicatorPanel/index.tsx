'use client';

// IndicatorPanel renders the indicator legend/status bar above or below the chart
// It shows which indicators are active with their current values

import { useStore } from '@/store';

const EMA_COLORS = ['#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];
const SMA_COLORS = ['#F97316', '#14B8A6'];

export default function IndicatorPanel() {
  const { activeIndicators, emaPeriods, smaPeriods } = useStore();

  const legendItems: { label: string; color: string }[] = [];

  if (activeIndicators.includes('BOLLINGER')) {
    legendItems.push({ label: 'BB(20,2)', color: '#64748b' });
  }
  if (activeIndicators.includes('EMA')) {
    emaPeriods.forEach((period, idx) => {
      legendItems.push({ label: `EMA${period}`, color: EMA_COLORS[idx % EMA_COLORS.length] });
    });
  }
  if (activeIndicators.includes('SMA')) {
    smaPeriods.forEach((period, idx) => {
      legendItems.push({ label: `SMA${period}`, color: SMA_COLORS[idx % SMA_COLORS.length] });
    });
  }

  if (legendItems.length === 0) return null;

  return (
    <div className="flex items-center gap-3 flex-wrap px-1">
      {legendItems.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-0.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[10px] font-mono text-text-muted">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
