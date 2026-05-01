'use client';

import { useState, useEffect } from 'react';
import { useT } from '@/lib/i18n';

// Replace with your actual Buy Me a Coffee username after signing up at buymeacoffee.com
const BMAC_URL = 'https://buymeacoffee.com/yourusername';

const STORAGE_KEY = 'bmac_dismissed_at';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function DonationBanner() {
  const tr = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (!dismissedAt || Date.now() - Number(dismissedAt) > SEVEN_DAYS_MS) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-2 bg-panel border-t border-amber-500/30 text-center">
      <span className="text-[11px] font-sans text-text-muted leading-none">
        {tr('donationMessage')}
      </span>
      <a
        href={BMAC_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors text-[11px] font-sans font-semibold text-black"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="2" y="6" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 8h1.5a1.5 1.5 0 0 1 0 3H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5 4c0-1.5 2-1.5 2-3M8 4c0-1.5 2-1.5 2-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {tr('donationCta')}
      </a>
      <button
        onClick={dismiss}
        className="shrink-0 p-1 text-text-dim hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
