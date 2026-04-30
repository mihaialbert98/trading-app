'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import type { WidgetId } from '@/store';
import { useT } from '@/lib/i18n';

const WIDGET_LABELS: Record<WidgetId, { ro: string; en: string }> = {
  signals: { ro: 'Semnale', en: 'Signals' },
  'custom-signals': { ro: 'Semnale Personalizate', en: 'Custom Signals' },
  fundamentals: { ro: 'Date Fundamentale', en: 'Fundamentals' },
  news: { ro: 'Știri', en: 'News' },
};

export default function WidgetManager() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const widgets = useStore((s) => s.widgets);
  const toggleVisible = useStore((s) => s.toggleWidgetVisible);
  const locale = useStore((s) => s.locale);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`p-1.5 rounded border transition-colors text-text-muted hover:text-accent hover:border-accent ${open ? 'border-accent text-accent' : 'border-border-subtle'}`}
        aria-label="Manage widgets"
        title={locale === 'ro' ? 'Gestionează widget-uri' : 'Manage widgets'}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM11.2 7a4.2 4.2 0 0 0-.04-.5l1.1-.86a.5.5 0 0 0 .12-.63l-1.05-1.82a.5.5 0 0 0-.61-.22l-1.3.52a4.2 4.2 0 0 0-.87-.5L8.3 1.56A.5.5 0 0 0 7.8 1.1H5.7a.5.5 0 0 0-.5.46l-.18 1.4a4.2 4.2 0 0 0-.87.5L2.85 3.0a.5.5 0 0 0-.61.22L1.2 5.02a.5.5 0 0 0 .12.63l1.1.86A4.2 4.2 0 0 0 2.38 7c0 .17.01.34.04.5l-1.1.86a.5.5 0 0 0-.12.63l1.05 1.82c.12.22.39.3.61.22l1.3-.52c.27.19.56.36.87.5l.18 1.4c.05.28.3.46.5.46h2.1a.5.5 0 0 0 .5-.46l.18-1.4c.31-.14.6-.31.87-.5l1.3.52a.5.5 0 0 0 .61-.22l1.05-1.82a.5.5 0 0 0-.12-.63l-1.1-.86c.03-.16.04-.33.04-.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-panel border border-border-subtle rounded-lg shadow-lg w-52 py-1">
          <p className="px-3 py-1.5 text-[10px] font-sans text-text-dim uppercase tracking-wide border-b border-border-subtle mb-1">
            {locale === 'ro' ? 'Widget-uri vizibile' : 'Visible widgets'}
          </p>
          {widgets.map((w) => (
            <button
              key={w.id}
              onClick={() => toggleVisible(w.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-panel-hover transition-colors text-left"
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  w.visible
                    ? 'bg-accent border-accent'
                    : 'bg-transparent border-border-subtle'
                }`}
              >
                {w.visible && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                    <path
                      d="M1 4l2 2 4-4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-xs font-sans text-text-primary">
                {WIDGET_LABELS[w.id][locale]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
