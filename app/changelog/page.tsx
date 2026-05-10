'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CHANGELOG } from '@/lib/changelogContent';
import type { ChangeEntry } from '@/lib/changelogContent';
import type { Locale } from '@/lib/i18n';

const TAG_STYLES: Record<ChangeEntry['tag'], string> = {
  feature: 'bg-accent/20 text-accent',
  fix: 'bg-loss/20 text-loss',
  improvement: 'bg-gain/20 text-gain',
};

const TAG_LABELS: Record<ChangeEntry['tag'], { ro: string; en: string }> = {
  feature: { ro: 'Funcționalitate', en: 'Feature' },
  fix: { ro: 'Remediere', en: 'Fix' },
  improvement: { ro: 'Îmbunătățire', en: 'Improvement' },
};

function VersionCard({ entry, locale }: { entry: ChangeEntry; locale: Locale }) {
  const L = locale;
  const isLatest = CHANGELOG.indexOf(entry) === 0;

  return (
    <div
      id={`v${entry.version}`}
      className={`scroll-mt-24 rounded-xl border bg-panel p-5 ${
        isLatest ? 'border-accent/40' : 'border-border-subtle'
      }`}
    >
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-text-primary text-base">
            v{entry.version}
          </span>
          {isLatest && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent text-white">
              {L === 'ro' ? 'CURENT' : 'LATEST'}
            </span>
          )}
          <span
            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${TAG_STYLES[entry.tag]}`}
          >
            {TAG_LABELS[entry.tag][L].toUpperCase()}
          </span>
        </div>
        <span className="ml-auto font-mono text-xs text-text-dim shrink-0">
          {new Date(entry.date).toLocaleDateString(L === 'ro' ? 'ro-RO' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <h2 className="font-sans font-semibold text-text-primary text-sm mb-3">
        {entry.title[L]}
      </h2>

      <ul className="space-y-2">
        {entry.items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-xs font-sans text-text-muted leading-relaxed">
            <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-accent/60" />
            {item[L]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChangelogPage() {
  const [locale, setLocale] = useState<Locale>('ro');
  const L = locale;

  const UI = {
    title: { ro: 'Jurnal de modificări', en: 'Changelog' },
    subtitle: {
      ro: 'Istoricul complet al versiunilor StockScope — funcționalități noi, remedieri și îmbunătățiri.',
      en: 'Complete version history of StockScope — new features, fixes and improvements.',
    },
    back: { ro: '← Înapoi la aplicație', en: '← Back to app' },
    help: { ro: 'Ghid de utilizare', en: 'User guide' },
    nav: { ro: 'Versiuni', en: 'Versions' },
  };

  return (
    <div className="min-h-screen bg-navy text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-panel border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 10l3-4 2 2 3-5 2 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-sans font-bold text-text-primary text-base">StockScope</span>
            </Link>
            <span className="text-border-subtle hidden sm:block">/</span>
            <span className="font-sans text-text-muted text-sm hidden sm:block">{UI.title[L]}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex rounded border border-border-subtle overflow-hidden">
              {(['ro', 'en'] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold transition-colors ${
                    locale === loc
                      ? 'bg-accent text-white'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/" className="text-xs font-sans text-accent hover:underline hidden sm:block">
              {UI.back[L]}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 flex gap-10">
        {/* Sticky sidebar nav */}
        <nav className="hidden lg:block w-44 shrink-0">
          <div className="sticky top-24 space-y-0.5">
            <p className="text-[10px] font-mono font-semibold text-text-dim uppercase tracking-wider px-3 mb-2">
              {UI.nav[L]}
            </p>
            {CHANGELOG.map((entry) => (
              <a
                key={entry.version}
                href={`#v${entry.version}`}
                className="flex items-center justify-between px-3 py-1.5 rounded text-xs font-mono text-text-muted hover:text-text-primary hover:bg-panel-hover transition-colors"
              >
                <span>v{entry.version}</span>
                <span className="text-text-dim text-[10px]">{entry.date.slice(0, 7)}</span>
              </a>
            ))}
            <div className="pt-4 border-t border-border-subtle mt-4">
              <Link
                href="/help"
                className="block px-3 py-1.5 rounded text-xs font-sans text-text-muted hover:text-text-primary hover:bg-panel-hover transition-colors"
              >
                {UI.help[L]} →
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Intro banner */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 mb-8">
            <h1 className="text-2xl font-sans font-bold text-text-primary mb-2">
              {UI.title[L]}
            </h1>
            <p className="text-text-muted font-sans text-sm leading-relaxed">
              {UI.subtitle[L]}
            </p>
          </div>

          {/* Version cards */}
          <div className="space-y-5">
            {CHANGELOG.map((entry) => (
              <VersionCard key={entry.version} entry={entry} locale={L} />
            ))}
          </div>
        </main>
      </div>

      <footer className="border-t border-border-subtle bg-panel mt-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs font-sans text-text-dim">
            {L === 'ro'
              ? 'Doar în scop informativ. Nu constituie consiliere financiară.'
              : 'For informational purposes only. Not financial advice.'}
          </p>
          <Link href="/" className="text-xs font-sans text-accent hover:underline">
            {UI.back[L]}
          </Link>
        </div>
      </footer>
    </div>
  );
}
