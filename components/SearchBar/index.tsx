'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { useStore } from '@/store';
import { useT } from '@/lib/i18n';
import CompanyLogo from '@/components/CompanyLogo';
import type { SearchResult } from '@/types/stock';

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸',
  GB: '🇬🇧',
  DE: '🇩🇪',
  FR: '🇫🇷',
  JP: '🇯🇵',
  CN: '🇨🇳',
  CA: '🇨🇦',
  AU: '🇦🇺',
  HK: '🇭🇰',
  IN: '🇮🇳',
  BR: '🇧🇷',
  KR: '🇰🇷',
  CH: '🇨🇭',
  SE: '🇸🇪',
  NL: '🇳🇱',
  IT: '🇮🇹',
  ES: '🇪🇸',
  SG: '🇸🇬',
  TW: '🇹🇼',
  MX: '🇲🇽',
};

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country?.toUpperCase()] ?? '';
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { results, isLoading, error } = useSearch(query);
  const setSelectedSymbol = useStore((s) => s.setSelectedSymbol);
  const tr = useT();

  const open = focused && query.trim().length >= 1;

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setSelectedSymbol(result.symbol, result.name);
      setQuery('');
      setFocused(false);
      setActiveIndex(-1);
    },
    [setSelectedSymbol]
  );

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          placeholder={tr('searchPlaceholder')}
          className="
            w-full pl-9 pr-9 py-2.5 rounded-lg
            bg-panel border border-border-subtle
            text-text-primary placeholder-text-muted
            font-sans text-sm
            focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
            transition-colors
          "
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <SpinnerIcon />
          </span>
        )}
        {!isLoading && query.length > 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            onClick={() => {
              setQuery('');
              setFocused(false);
              inputRef.current?.focus();
            }}
            aria-label="Șterge căutarea"
          >
            <XIcon />
          </button>
        )}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full left-0 right-0 mt-1 z-50
            bg-panel border border-border-subtle rounded-lg
            shadow-2xl shadow-black/50
            max-h-80 overflow-y-auto
          "
        >
          {error && (
            <div className="px-4 py-3 text-loss text-sm font-sans">
              {tr('searchFailed')}
            </div>
          )}
          {!error && !isLoading && results.length === 0 && query.trim().length >= 1 && (
            <div className="px-4 py-3 text-text-muted text-sm font-sans">
              {tr('noResults')} &quot;{query}&quot;
            </div>
          )}
          {results.map((result, idx) => {
            const flag = getFlag(result.country);
            return (
              <button
                key={result.symbol}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left
                  hover:bg-panel-hover transition-colors
                  ${idx === activeIndex ? 'bg-panel-hover' : ''}
                  ${idx !== results.length - 1 ? 'border-b border-border-subtle' : ''}
                `}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before select
                  handleSelect(result);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <CompanyLogo symbol={result.symbol} name={result.name} size={28} />
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="font-mono font-bold text-accent text-sm tracking-wide">
                      {result.symbol}
                    </span>
                    <span className="
                      text-[10px] font-sans font-medium px-1.5 py-0.5 rounded
                      bg-border-subtle text-text-muted uppercase tracking-wide
                    ">
                      {result.exchange}
                    </span>
                    {flag && (
                      <span className="text-sm leading-none" aria-hidden>
                        {flag}
                      </span>
                    )}
                  </span>
                  <span className="block text-text-muted text-xs font-sans truncate mt-0.5">
                    {result.name}
                  </span>
                </span>
                <span className="text-text-dim text-xs font-sans shrink-0 uppercase">
                  {result.type}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12ZM14 14l-3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <circle
        cx="7"
        cy="7"
        r="5"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.3"
      />
      <path
        d="M7 2a5 5 0 0 1 5 5"
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 2l10 10M12 2L2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
