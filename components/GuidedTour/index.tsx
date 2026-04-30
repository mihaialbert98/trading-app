'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/store';

interface TourStep {
  target: string; // CSS selector
  title: Record<'ro' | 'en', string>;
  body: Record<'ro' | 'en', string>;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="search"]',
    title: { ro: 'Bara de căutare', en: 'Search bar' },
    body: {
      ro: 'Caută orice acțiune listată pe bursele internaționale după simbol (AAPL, MSFT) sau numele companiei. Rezultatele apar instant cu logo, bursă și țara de origine.',
      en: 'Search any listed stock by ticker (AAPL, MSFT) or company name. Results appear instantly with logo, exchange and country of origin.',
    },
    position: 'right',
  },
  {
    target: '[data-tour="watchlist"]',
    title: { ro: 'Lista de urmărire', en: 'Watchlist' },
    body: {
      ro: 'Salvează acțiunile de interes pentru acces rapid. Fiecare acțiune afișează prețul live și variația zilnică. Datele se actualizează la fiecare 30 de secunde în orele de tranzacționare.',
      en: 'Save stocks of interest for quick access. Each shows the live price and daily change. Data updates every 30 seconds during trading hours.',
    },
    position: 'right',
  },
  {
    target: '[data-tour="timeframe"]',
    title: { ro: 'Selector de timp', en: 'Timeframe selector' },
    body: {
      ro: 'Alege perioada graficului: 1D și 5D afișează lumânări orare. 1M–5Y afișează lumânări zilnice, săptămânale sau lunare. Perioade mai lungi oferă semnale mai fiabile.',
      en: 'Choose the chart period: 1D and 5D show hourly candles. 1M–5Y show daily, weekly or monthly candles. Longer periods provide more reliable signals.',
    },
    position: 'bottom',
  },
  {
    target: '[data-tour="indicators"]',
    title: { ro: 'Indicatori tehnici', en: 'Technical indicators' },
    body: {
      ro: 'Activează sau dezactivează indicatorii: RSI, MACD, Bollinger Bands, EMA, SMA, Volum, Stochastic și ATR. Indicatorii activi sunt evidențiați cu albastru.',
      en: 'Toggle indicators on or off: RSI, MACD, Bollinger Bands, EMA, SMA, Volume, Stochastic and ATR. Active indicators are highlighted in blue.',
    },
    position: 'bottom',
  },
  {
    target: '[data-tour="chart"]',
    title: { ro: 'Graficul principal', en: 'Main chart' },
    body: {
      ro: 'Grafic candlestick interactiv. Scroll pentru zoom, drag pentru navigare în timp. Semnalele apar ca săgeți verzi (▲ cumpărare) și roșii (▼ vânzare) direct pe lumânări.',
      en: 'Interactive candlestick chart. Scroll to zoom, drag to navigate through time. Signals appear as green arrows (▲ buy) and red arrows (▼ sell) directly on candles.',
    },
    position: 'top',
  },
  {
    target: '[data-tour="signal-log"]',
    title: { ro: 'Semnale de tranzacționare', en: 'Trading signals' },
    body: {
      ro: 'Lista completă a semnalelor detectate, de la cel mai recent. Fă clic pe orice semnal pentru a naviga la acel moment pe grafic — se evidențiază cu o linie albastră verticală.',
      en: 'Complete list of detected signals, newest first. Click any signal to navigate to that moment on the chart — it highlights with a blue vertical line.',
    },
    position: 'left',
  },
  {
    target: '[data-tour="custom-signals"]',
    title: { ro: 'Semnale personalizate', en: 'Custom signals' },
    body: {
      ro: 'Construiește propriile reguli tehnice din dropdown-uri. Alege indicator → condiție → valoare/indicator. Combină mai multe condiții cu AND. Regulile se salvează local și se evaluează imediat pe date reale.',
      en: 'Build your own technical rules using dropdowns. Choose indicator → condition → value/indicator. Combine multiple conditions with AND. Rules are saved locally and evaluated immediately on real data.',
    },
    position: 'left',
  },
  {
    target: '[data-tour="fundamentals"]',
    title: { ro: 'Date fundamentale', en: 'Fundamentals' },
    body: {
      ro: 'Cap. de Piață, P/E, EPS, dividend, 52W High/Low și consensul analiștilor. Apasă "Vezi detalii complete" pentru descrierea companiei, toate metricile și știrile complete.',
      en: 'Market cap, P/E, EPS, dividend, 52W High/Low and analyst consensus. Press "View full details" for company description, all metrics and full news.',
    },
    position: 'left',
  },
];

interface PopupStyle {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  maxWidth: number;
}

function computePopupStyle(
  rect: DOMRect,
  position: TourStep['position'],
  viewportW: number,
  viewportH: number,
): PopupStyle {
  const GAP = 12;
  const W = Math.min(300, viewportW - 32);

  switch (position) {
    case 'right':
      return {
        top: Math.max(8, Math.min(rect.top + rect.height / 2 - 60, viewportH - 200)),
        left: Math.min(rect.right + GAP, viewportW - W - 8),
        maxWidth: W,
      };
    case 'left':
      return {
        top: Math.max(8, Math.min(rect.top + rect.height / 2 - 60, viewportH - 200)),
        right: Math.max(8, viewportW - rect.left + GAP),
        maxWidth: W,
      };
    case 'bottom':
      return {
        top: rect.bottom + GAP,
        left: Math.max(8, Math.min(rect.left, viewportW - W - 8)),
        maxWidth: W,
      };
    case 'top':
    default:
      return {
        bottom: Math.max(8, viewportH - rect.top + GAP),
        left: Math.max(8, Math.min(rect.left, viewportW - W - 8)),
        maxWidth: W,
      };
  }
}

export default function GuidedTour({ onFinish }: { onFinish: () => void }) {
  const locale = useStore((s) => s.locale);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popupStyle, setPopupStyle] = useState<PopupStyle | null>(null);
  const initializedRef = useRef(false);

  const locateStep = useCallback((stepIdx: number) => {
    const step = TOUR_STEPS[stepIdx];
    if (!step) return;
    const el = document.querySelector(step.target);
    if (!el) {
      setTargetRect(null);
      setPopupStyle(null);
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      setPopupStyle(computePopupStyle(rect, step.position, window.innerWidth, window.innerHeight));
    });
  }, []);

  // Locate first step on mount via ref guard — avoids setState-in-effect lint
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    requestAnimationFrame(() => locateStep(0));
  }, [locateStep]);

  function goTo(idx: number) {
    if (idx >= TOUR_STEPS.length) { onFinish(); return; }
    setCurrentStep(idx);
    locateStep(idx);
  }

  const current = TOUR_STEPS[currentStep];

  return (
    <>
      {/* Dark overlay with spotlight */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {targetRect && (
          <svg className="w-full h-full" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <mask id="spotlight">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={targetRect.left - 6}
                  y={targetRect.top - 6}
                  width={targetRect.width + 12}
                  height={targetRect.height + 12}
                  rx={6}
                  fill="black"
                />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#spotlight)" />
            {/* Highlight border */}
            <rect
              x={targetRect.left - 6}
              y={targetRect.top - 6}
              width={targetRect.width + 12}
              height={targetRect.height + 12}
              rx={6}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      {/* Popup */}
      {popupStyle && current && (
        <div
          className="fixed z-[101] bg-panel border border-accent/40 rounded-xl shadow-2xl p-4 pointer-events-auto"
          style={popupStyle}
        >
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-accent">
              {currentStep + 1} / {TOUR_STEPS.length}
            </span>
            <button
              onClick={onFinish}
              className="text-text-dim hover:text-text-primary transition-colors"
              title={locale === 'ro' ? 'Închide turul' : 'Close tour'}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <h3 className="font-sans font-bold text-text-primary text-sm mb-1.5">
            {current.title[locale]}
          </h3>
          <p className="text-xs font-sans text-text-muted leading-relaxed mb-4">
            {current.body[locale]}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentStep ? 'bg-accent' : 'bg-border-subtle hover:bg-text-dim'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => goTo(currentStep - 1)}
                  className="px-2.5 py-1 text-xs font-sans text-text-muted border border-border-subtle rounded hover:text-text-primary transition-colors"
                >
                  {locale === 'ro' ? 'Înapoi' : 'Back'}
                </button>
              )}
              <button
                onClick={() => goTo(currentStep + 1)}
                className="px-2.5 py-1 text-xs font-sans bg-accent text-white rounded hover:bg-accent/80 transition-colors"
              >
                {currentStep === TOUR_STEPS.length - 1
                  ? (locale === 'ro' ? 'Finalizează' : 'Finish')
                  : (locale === 'ro' ? 'Următor' : 'Next')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
