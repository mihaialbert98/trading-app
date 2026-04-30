'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';
import { useStore } from '@/store';
import type { NewsItem } from '@/types/stock';

interface NewsDrawerProps {
  item: NewsItem;
  onClose: () => void;
}

const SUGGESTION_STYLE = {
  BUY:  { bg: 'bg-gain/10', text: 'text-gain', border: 'border-gain/30' },
  SELL: { bg: 'bg-loss/10', text: 'text-loss', border: 'border-loss/30' },
  HOLD: { bg: 'bg-border-subtle', text: 'text-text-muted', border: 'border-border-subtle' },
};

const CONFIDENCE_STYLE = {
  HIGH:   'text-gain',
  MEDIUM: 'text-yellow-400',
  LOW:    'text-text-muted',
};

function formatNewsDate(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).format(new Date(ts));
}

function buildExplanation(item: NewsItem, locale: 'ro' | 'en'): string {
  const kw = item.matchedKeywords;
  const kwList = kw.length > 0 ? `«${kw.join('», «')}»` : '';

  if (locale === 'ro') {
    if (item.suggestion === 'BUY') {
      return kw.length > 0
        ? `Titlul conține termeni pozitivi: ${kwList}. Pe baza acestora, analiza sugerează o tendință de cumpărare.`
        : 'Nu au fost detectați termeni puternici. Sugestia este neutră.';
    }
    if (item.suggestion === 'SELL') {
      return kw.length > 0
        ? `Titlul conține termeni negativi: ${kwList}. Pe baza acestora, analiza sugerează prudență și o posibilă tendință de vânzare.`
        : 'Nu au fost detectați termeni puternici. Sugestia este neutră.';
    }
    return 'Titlul nu conține termeni direcționali clari. Sentimentul este neutru.';
  } else {
    if (item.suggestion === 'BUY') {
      return kw.length > 0
        ? `The headline contains positive terms: ${kwList}. Based on these signals, the analysis suggests a bullish tendency.`
        : 'No strong directional terms detected. Suggestion is neutral.';
    }
    if (item.suggestion === 'SELL') {
      return kw.length > 0
        ? `The headline contains negative terms: ${kwList}. Based on these signals, the analysis suggests caution and a potential bearish tendency.`
        : 'No strong directional terms detected. Suggestion is neutral.';
    }
    return 'The headline contains no clear directional terms. Sentiment is neutral.';
  }
}

export default function NewsDrawer({ item, onClose }: NewsDrawerProps) {
  const tr = useT();
  const locale = useStore((s) => s.locale);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPanelVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const suggStyle = SUGGESTION_STYLE[item.suggestion];
  const confStyle = CONFIDENCE_STYLE[item.confidence];
  const suggestionLabel = tr(
    item.suggestion === 'BUY' ? 'suggestionBuy'
    : item.suggestion === 'SELL' ? 'suggestionSell'
    : 'suggestionHold'
  );
  const confidenceLabel = tr(
    item.confidence === 'HIGH' ? 'confidenceHigh'
    : item.confidence === 'MEDIUM' ? 'confidenceMedium'
    : 'confidenceLow'
  );
  const explanation = buildExplanation(item, locale);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        className={`
          relative w-full max-w-md h-full bg-panel border-l border-border-subtle
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-out
          ${panelVisible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="min-w-0">
            <p className="text-xs font-sans text-text-muted truncate">{item.source}</p>
            <p className="text-xs font-mono text-text-dim">{formatNewsDate(item.publishedAt)}</p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Thumbnail */}
          {item.thumbnail && (
            <div className="w-full h-48 overflow-hidden bg-border-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-5 space-y-5">
            {/* Title */}
            <h2 className="text-lg font-sans font-semibold text-text-primary leading-snug">
              {item.title}
            </h2>

            {/* AI Analysis section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-accent shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <h3 className="text-xs font-sans font-semibold text-text-primary uppercase tracking-wide">
                  {tr('aiAnalysis')}
                </h3>
              </div>

              {/* Suggestion + Confidence */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-mono font-bold px-3 py-1.5 rounded-lg border ${suggStyle.bg} ${suggStyle.text} ${suggStyle.border}`}>
                  {suggestionLabel}
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-sans text-text-dim uppercase tracking-wide">{tr('aiConfidence')}</span>
                  <span className={`text-xs font-mono font-semibold ${confStyle}`}>{confidenceLabel}</span>
                </div>
              </div>

              {/* Explanation */}
              <p className="text-sm font-sans text-text-muted leading-relaxed">
                {explanation}
              </p>

              {/* Disclaimer */}
              <div className="flex gap-2 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-yellow-400 shrink-0 mt-0.5">
                  <path d="M7 1L1 12h12L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  <path d="M7 5v3M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <p className="text-xs font-sans text-text-muted leading-relaxed">
                  {tr('aiDisclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — external link */}
        <div className="shrink-0 px-5 py-4 border-t border-border-subtle">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-accent hover:bg-accent/80 text-white text-sm font-sans font-medium transition-colors"
          >
            {tr('readFullArticle')}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 10l8-8M4 2h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
