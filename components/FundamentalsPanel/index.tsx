'use client';

import useSWR from 'swr';
import { useStore } from '@/store';
import type { CompanyInfo } from '@/types/stock';

const fetcher = (url: string): Promise<CompanyInfo> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json() as Promise<CompanyInfo>;
  });

function formatMarketCap(val: number | null): string {
  if (val === null) return '—';
  if (val >= 1e12)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(val);
  if (val >= 1e9)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(val);
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

function AnalystRatingBar({ rating }: { rating: number }) {
  // rating: 1=Cump. Puternică, 5=Vânz. Puternică
  const pct = ((rating - 1) / 4) * 100;
  const label =
    rating <= 1.5
      ? 'Cumpărare Puternică'
      : rating <= 2.5
      ? 'Buy'
      : rating <= 3.5
      ? 'Hold'
      : rating <= 4.5
      ? 'Sell'
      : 'Vânzare Puternică';
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
        <span className="text-xs font-sans text-text-muted">Rating Analiști</span>
        <span className="text-xs font-mono text-text-primary">{label}</span>
      </div>
      <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-text-dim mt-0.5">
        <span>Cump. Puternică</span>
        <span>Vânz. Puternică</span>
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

export default function FundamentalsPanel() {
  const selectedSymbol = useStore((s) => s.selectedSymbol);

  const { data, isLoading, error } = useSWR<CompanyInfo>(
    selectedSymbol ? `/api/fundamentals?symbol=${encodeURIComponent(selectedSymbol)}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  return (
    <div className="bg-panel border border-border-subtle rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border-subtle">
        <h2 className="text-sm font-sans font-semibold text-text-primary tracking-wide uppercase">
          Date Fundamentale
        </h2>
      </div>

      {!selectedSymbol && (
        <div className="px-4 py-6 text-center text-text-muted text-sm font-sans">
          Selectează o acțiune pentru date fundamentale
        </div>
      )}

      {selectedSymbol && isLoading && <SkeletonFundamentals />}

      {selectedSymbol && error && (
        <div className="px-4 py-4 text-center text-loss text-sm font-sans">
          Eroare la încărcarea datelor
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

          {/* Description */}
          {data.description && (
            <p className="text-xs text-text-muted font-sans leading-relaxed line-clamp-4">
              {data.description}
            </p>
          )}

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <MetricItem label="Cap. de Piață" value={formatMarketCap(data.marketCap)} />
            <MetricItem label="Raport P/E" value={formatNumber(data.peRatio, 1)} />
            <MetricItem label="EPS" value={data.eps !== null ? `$${formatNumber(data.eps)}` : '—'} />
            <MetricItem label="Dividend" value={formatPercent(data.dividendYield)} />
            <MetricItem
              label="52W High"
              value={data.week52High !== null ? `$${formatNumber(data.week52High)}` : '—'}
            />
            <MetricItem
              label="52W Low"
              value={data.week52Low !== null ? `$${formatNumber(data.week52Low)}` : '—'}
            />
          </div>

          {/* Analyst rating */}
          {data.analystRating !== null && (
            <div className="pt-1">
              <AnalystRatingBar rating={data.analystRating} />
              {data.analystCount !== null && (
                <p className="text-[10px] font-sans text-text-dim mt-1 text-center">
                  Bazat pe{' '}
                  {new Intl.NumberFormat('en-US').format(data.analystCount)} opinie de analist
                  {data.analystCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
