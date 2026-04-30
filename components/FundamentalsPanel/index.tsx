'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useStore } from '@/store';
import { useT } from '@/lib/i18n';
import { useTranslatedText } from '@/hooks/useTranslation';
import CompanyModal from '@/components/CompanyModal';
import type { CompanyInfo } from '@/types/stock';

const fetcher = (url: string): Promise<CompanyInfo> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json() as Promise<CompanyInfo>;
  });

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
  const ratingText =
    rating <= 1.5
      ? strongBuyLabel
      : rating <= 2.5
      ? 'Buy'
      : rating <= 3.5
      ? 'Hold'
      : rating <= 4.5
      ? 'Sell'
      : strongSellLabel;
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
        <span className="text-xs font-mono text-text-primary">{ratingText}</span>
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

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-sans text-text-dim uppercase tracking-wide">{label}</span>
      <span className="text-sm font-mono text-text-primary tabular-nums">{value}</span>
    </div>
  );
}

function SkeletonFundamentals() {
  return (
    <div className="p-4 space-y-3">
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-16 rounded" />
      <div className="grid grid-cols-2 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-10 rounded" />
        ))}
      </div>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M8.5 1.5H12.5V5.5M5.5 8.5L12.5 1.5M1.5 5.5V1.5H5.5M8.5 12.5H12.5V8.5M5.5 5.5L1.5 12.5M8.5 8.5L12.5 12.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin shrink-0"
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <path d="M7 2a5 5 0 0 1 5 5" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function FundamentalsPanel() {
  const selectedSymbol = useStore((s) => s.selectedSymbol);
  const selectedName = useStore((s) => s.selectedName);
  const locale = useStore((s) => s.locale);
  const tr = useT();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, error } = useSWR<CompanyInfo>(
    selectedSymbol ? `/api/fundamentals?symbol=${encodeURIComponent(selectedSymbol)}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  const { translated: translatedDesc, isTranslating } = useTranslatedText(data?.description);

  return (
    <>
      <div className="bg-panel border border-border-subtle rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
          <h2 className="text-sm font-sans font-semibold text-text-primary tracking-wide uppercase">
            {tr('fundamentalsTitle')}
          </h2>
          {data && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 text-xs font-sans text-text-muted hover:text-accent transition-colors"
              aria-label={tr('expandDetails')}
              title={tr('expandDetails')}
            >
              <ExpandIcon />
            </button>
          )}
        </div>

        {!selectedSymbol && (
          <div className="px-4 py-6 text-center text-text-muted text-sm font-sans">
            {tr('selectStockFundamentals')}
          </div>
        )}

        {selectedSymbol && isLoading && <SkeletonFundamentals />}

        {selectedSymbol && error && (
          <div className="px-4 py-4 text-center text-loss text-sm font-sans">
            {tr('fundamentalsError')}
          </div>
        )}

        {data && !isLoading && (
          <div className="p-4 space-y-4">
            {/* Company header */}
            <div>
              <h3 className="text-base font-sans font-semibold text-text-primary leading-tight">
                {data.name}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {data.sector && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-border-subtle text-text-muted font-sans">
                    {data.sector}
                  </span>
                )}
                {data.industry && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-border-subtle text-text-muted font-sans">
                    {data.industry}
                  </span>
                )}
                {data.country && (
                  <span className="text-xs text-text-dim font-sans">{data.country}</span>
                )}
              </div>
            </div>

            {/* Description — translated if locale=ro */}
            {(isTranslating || translatedDesc) && (
              <div>
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-text-muted text-xs font-sans">
                    <SpinnerIcon />
                    <span>{tr('translating')}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-text-muted font-sans leading-relaxed line-clamp-4">
                      {translatedDesc}
                    </p>
                    {locale === 'ro' && translatedDesc && translatedDesc !== data.description && (
                      <span className="text-[10px] font-sans text-text-dim mt-0.5 block">
                        {tr('descriptionTranslated')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Key metrics grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <MetricItem label={tr('marketCap')} value={formatMarketCap(data.marketCap)} />
              <MetricItem label={tr('peRatio')} value={formatNumber(data.peRatio, 1)} />
              <MetricItem
                label={tr('eps')}
                value={data.eps !== null ? `$${formatNumber(data.eps)}` : '—'}
              />
              <MetricItem label={tr('dividend')} value={formatPercent(data.dividendYield)} />
              <MetricItem
                label={tr('week52High')}
                value={data.week52High !== null ? `$${formatNumber(data.week52High)}` : '—'}
              />
              <MetricItem
                label={tr('week52Low')}
                value={data.week52Low !== null ? `$${formatNumber(data.week52Low)}` : '—'}
              />
            </div>

            {/* Analyst rating */}
            {data.analystRating !== null && (
              <div className="pt-1">
                <AnalystRatingBar
                  rating={data.analystRating}
                  strongBuyLabel={tr('strongBuyLabel')}
                  strongSellLabel={tr('strongSellLabel')}
                  ratingLabel={tr('analystRating')}
                />
                {data.analystCount !== null && (
                  <p className="text-[10px] font-sans text-text-dim mt-1 text-center">
                    {tr('basedOn')}{' '}
                    {new Intl.NumberFormat('en-US').format(data.analystCount)}{' '}
                    {data.analystCount === 1 ? tr('analystOpinion') : tr('analystOpinions')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && selectedSymbol && (
        <CompanyModal
          symbol={selectedSymbol}
          name={selectedName ?? selectedSymbol}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
