'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import Watchlist from '@/components/Watchlist';
import StockChart from '@/components/StockChart';
import TimeframeSelector from '@/components/TimeframeSelector';
import IndicatorToggle from '@/components/IndicatorToggle';
import IndicatorPanel from '@/components/IndicatorPanel';
import SignalLog from '@/components/SignalLog';
import FundamentalsPanel from '@/components/FundamentalsPanel';
import NewsPanel from '@/components/NewsPanel';
import { useStore } from '@/store';

function ThemeToggle() {
  const { theme, toggleTheme } = useStore();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded text-text-muted hover:text-text-primary transition-colors"
      aria-label="Schimbă tema"
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 1v1M8 14v1M1 8H.5M15.5 8H15M3.05 3.05l-.7-.7M13.65 13.65l-.7-.7M3.05 12.95l-.7.7M13.65 2.35l-.7.7M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M13.5 10a6 6 0 0 1-7.5-7.5 6 6 0 1 0 7.5 7.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function Sidebar() {
  const { selectedSymbol, selectedName, addToWatchlist, watchlist } = useStore();
  const isWatched = selectedSymbol
    ? watchlist.some((w) => w.symbol === selectedSymbol)
    : false;

  return (
    <aside className="w-full md:w-[280px] md:shrink-0 flex flex-col gap-3 overflow-y-auto">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 10l3-4 2 2 3-5 2 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-sans font-bold text-text-primary text-base tracking-tight">
            StockScope
          </span>
        </div>
        <ThemeToggle />
      </div>

      <SearchBar />

      {selectedSymbol && !isWatched && (
        <button
          className="
            w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg
            border border-border-subtle text-text-muted hover:border-accent hover:text-accent
            text-xs font-sans transition-colors
          "
          onClick={() => addToWatchlist(selectedSymbol, selectedName ?? selectedSymbol)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Adaugă la Liste
        </button>
      )}

      <Watchlist />
    </aside>
  );
}

function RightPanel() {
  return (
    <aside className="w-full md:w-[320px] md:shrink-0 flex flex-col gap-3 overflow-y-auto">
      <SignalLog />
      <FundamentalsPanel />
      <NewsPanel />
    </aside>
  );
}

function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 md:hidden
          bg-panel border-t border-border-subtle rounded-t-2xl
          transition-transform duration-300
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          max-h-[80vh] overflow-y-auto
        `}
      >
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>
        <div className="px-4 pb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-sans font-semibold text-text-primary text-sm">Caută</span>
            <button
              className="text-text-muted text-xs font-sans hover:text-text-primary"
              onClick={onClose}
            >
              Închide
            </button>
          </div>
          <SearchBar />
          <Watchlist />
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-navy">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-panel md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 10l3-4 2 2 3-5 2 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-sans font-bold text-text-primary text-sm">StockScope</span>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-subtle text-text-muted text-xs font-sans hover:border-accent hover:text-accent transition-colors"
          onClick={() => setDrawerOpen(true)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 4h10M2 7h10M2 10h10"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Caută
        </button>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-3 p-0 md:p-3 min-h-0">
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col gap-2 min-w-0 min-h-0 p-2 md:p-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
            <TimeframeSelector />
            <div className="flex-1 min-w-0">
              <IndicatorToggle />
            </div>
          </div>

          <IndicatorPanel />

          <div className="flex-1 min-h-0" style={{ minHeight: '300px' }}>
            <StockChart />
          </div>
        </div>

        <div className="md:flex flex-col">
          <RightPanel />
        </div>
      </div>

      <footer className="px-4 py-2 border-t border-border-subtle text-center bg-panel">
        <p className="text-[11px] font-sans text-text-dim">
          Doar în scop informativ. Nu constituie consiliere financiară. Datele de piață au o întârziere de 15 minute.
        </p>
      </footer>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
