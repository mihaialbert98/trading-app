'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import CompanyLogo from '@/components/CompanyLogo';
import NewsCard from '@/components/NewsCard';
import NewsDrawer from '@/components/NewsDrawer';
import { useStore } from '@/store';
import { useT } from '@/lib/i18n';
import { useTranslatedText } from '@/hooks/useTranslation';
import type { CompanyInfo, NewsItem } from '@/types/stock';

const fetcher = <T,>(url: string): Promise<T> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Fetch failed');
    return r.json() as Promise<T>;
  });

interface CompanyModalProps {
  symbol: string;
  name: string;
  onClose: () => void;
}

function formatMarketCap(val: number | null): string {
  if (val === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(val);
}

function formatNumber(val: number | null, decimals = 2): string {
  if (val === null) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

function formatPercent(val: number | null): string {
  if (val === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-navy rounded-lg">
      <span className="text-[10px] font-sans text-text-dim uppercase tracking-wide">{label}</span>
      <span className="text-sm font-mono text-text-primary tabular-nums">{value}</span>
    </div>
  );
}

function SkeletonModal() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="skeleton w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
      </div>
      <div className="skeleton h-24 rounded" />
      <div className="grid grid-cols-2 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-14 rounded" />
        ))}
      </div>
    </div>
  );
}

function AnalystRatingBar({
  rating,
  strongBuyLabel,
  strongSellLabel,
  ratingLabel,
}: {
  rating: number;
  strongBuyLabel: string;
  strongSellLabel: string;
  ratingLabel: string;
}) {
  const pct = ((rating - 1) / 4) * 100;
  const color =
    rating <= 1.5
      ? 'bg-strong-buy'
      : rating <= 2.5
      ? 'bg-gain'
      : rating <= 3.5
      ? 'bg-warning'
      : rating <= 4.5
      ? 'bg-loss'
      : 'bg-strong-sell';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-sans text-text-muted">{ratingLabel}</span>
        <span className="text-xs font-mono text-text-primary">
          {rating <= 1.5
            ? strongBuyLabel
            : rating <= 2.5
            ? 'Buy'
            : rating <= 3.5
            ? 'Hold'
            : rating <= 4.5
            ? 'Sell'
            : strongSellLabel}
        </span>
      </div>
      <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-text-dim mt-0.5">
        <span>{strongBuyLabel}</span>
        <span>{strongSellLabel}</span>
      </div>
    </div>
  );
}

export default function CompanyModal({ symbol, name, onClose }: CompanyModalProps) {
  const tr = useT();
  const locale = useStore((s) => s.locale);
  const [panelVisible, setPanelVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const { data: fundamentals, isLoading: loadingFundamentals } = useSWR<CompanyInfo>(
    `/api/fundamentals?symbol=${encodeURIComponent(symbol)}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  const { data: news, isLoading: loadingNews } = useSWR<NewsItem[]>(
    `/api/news?symbol=${encodeURIComponent(symbol)}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  // Full description — not truncated; the panel truncates, the modal shows all
  const fullDescription = fundamentals?.description ?? null;
  const { translated: translatedDesc, isTranslating } = useTranslatedText(fullDescription);

  // Slide-in animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPanelVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ESC key close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const isLoading = loadingFundamentals;

  return (
    <>
    {selectedNews && (
      <NewsDrawer item={selectedNews} onClose={() => setSelectedNews(null)} />
    )}
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
          relative w-full max-w-2xl h-full
          bg-panel border-l border-border-subtle
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-out
          ${panelVisible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <CompanyLogo symbol={symbol} name={name} size={48} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-accent text-lg tracking-wide">
                  {symbol}
                </span>
                {fundamentals?.name && (
                  <span className="font-sans font-semibold text-text-primary text-base truncate">
                    {fundamentals.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                {fundamentals?.sector && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-border-subtle text-text-muted font-sans">
                    {fundamentals.sector}
                  </span>
                )}
                {fundamentals?.industry && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-border-subtle text-text-muted font-sans">
                    {fundamentals.industry}
                  </span>
                )}
                {fundamentals?.country && (
                  <span className="text-xs text-text-dim font-sans">{fundamentals.country}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded text-text-muted hover:text-text-primary hover:bg-panel-hover transition-colors"
            aria-label={tr('modalClose')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <SkeletonModal />
          ) : (
            <div className="p-6 space-y-6">
              {/* Description */}
              {(translatedDesc || isTranslating) && (
                <section>
                  <h3 className="text-xs font-sans font-semibold text-text-dim uppercase tracking-wide mb-2">
                    {tr('modalDescription')}
                  </h3>
                  {isTranslating ? (
                    <div className="flex items-center gap-2 text-text-muted text-sm font-sans">
                      <SpinnerIcon />
                      <span>{tr('translating')}</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-text-muted font-sans leading-relaxed">
                        {translatedDesc}
                      </p>
                      {locale === 'ro' && translatedDesc && translatedDesc !== fullDescription && (
                        <span className="text-[10px] font-sans text-text-dim mt-1 block">
                          {tr('descriptionTranslated')}
                        </span>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* Key metrics */}
              {fundamentals && (
                <section>
                  <h3 className="text-xs font-sans font-semibold text-text-dim uppercase tracking-wide mb-2">
                    {tr('modalKeyMetrics')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <MetricItem label={tr('marketCap')} value={formatMarketCap(fundamentals.marketCap)} />
                    <MetricItem label={tr('peRatio')} value={formatNumber(fundamentals.peRatio, 1)} />
                    <MetricItem
                      label={tr('eps')}
                      value={fundamentals.eps !== null ? `$${formatNumber(fundamentals.eps)}` : '—'}
                    />
                    <MetricItem label={tr('dividend')} value={formatPercent(fundamentals.dividendYield)} />
                    <MetricItem
                      label={tr('week52High')}
                      value={
                        fundamentals.week52High !== null
                          ? `$${formatNumber(fundamentals.week52High)}`
                          : '—'
                      }
                    />
                    <MetricItem
                      label={tr('week52Low')}
                      value={
                        fundamentals.week52Low !== null
                          ? `$${formatNumber(fundamentals.week52Low)}`
                          : '—'
                      }
                    />
                  </div>
                </section>
              )}

              {/* Analyst rating */}
              {fundamentals?.analystRating !== null && fundamentals?.analystRating !== undefined && (
                <section>
                  <AnalystRatingBar
                    rating={fundamentals.analystRating}
                    strongBuyLabel={tr('strongBuyLabel')}
                    strongSellLabel={tr('strongSellLabel')}
                    ratingLabel={tr('analystRating')}
                  />
                  {fundamentals.analystCount !== null && (
                    <p className="text-[10px] font-sans text-text-dim mt-1 text-center">
                      {tr('basedOn')}{' '}
                      {new Intl.NumberFormat('en-US').format(fundamentals.analystCount)}{' '}
                      {fundamentals.analystCount === 1
                        ? tr('analystOpinion')
                        : tr('analystOpinions')}
                    </p>
                  )}
                </section>
              )}

              {/* News section */}
              <section>
                <h3 className="text-xs font-sans font-semibold text-text-dim uppercase tracking-wide mb-3">
                  {tr('modalNewsSection')}
                </h3>
                {loadingNews ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="skeleton h-20 rounded" />
                    ))}
                  </div>
                ) : news && news.length > 0 ? (
                  <div className="space-y-2">
                    {news.map((item, idx) => (
                      <NewsCard key={`${item.publishedAt}-${idx}`} item={item} onSelect={() => setSelectedNews(item)} />
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-sm font-sans text-center py-4">
                    {tr('noNews')}
                  </p>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin shrink-0"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <path d="M7 2a5 5 0 0 1 5 5" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
