'use client';

import { useStore } from '@/store';
import SignalLog from '@/components/SignalLog';
import CustomSignalBuilder from '@/components/CustomSignalBuilder';
import FundamentalsPanel from '@/components/FundamentalsPanel';
import NewsPanel from '@/components/NewsPanel';
import WidgetManager from '@/components/WidgetManager';

export default function RightPanel() {
  const locale = useStore((s) => s.locale);

  return (
    <aside className="hidden md:flex flex-col w-[320px] shrink-0 self-stretch overflow-y-auto gap-2 pb-3">
      <div className="flex items-center justify-between px-1 pt-1 sticky top-0 z-10 bg-navy pb-1">
        <span className="text-[11px] font-sans text-text-dim uppercase tracking-wide">
          {locale === 'ro' ? 'Panouri' : 'Panels'}
        </span>
        <WidgetManager />
      </div>

      <SignalLog />
      <CustomSignalBuilder />
      <FundamentalsPanel />
      <NewsPanel />
    </aside>
  );
}
