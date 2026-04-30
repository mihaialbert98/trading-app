'use client';

import useSWR from 'swr';
import { useStore } from '@/store';
import { useT } from '@/lib/i18n';
import NewsCard from '@/components/NewsCard';
import Widget from '@/components/Widget';
import type { NewsItem } from '@/types/stock';

const fetcher = (url: string): Promise<NewsItem[]> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json() as Promise<NewsItem[]>;
  });

function SkeletonNews() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="skeleton w-16 h-16 rounded shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 rounded w-full" />
            <div className="skeleton h-4 rounded w-3/4" />
            <div className="skeleton h-3 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsPanel() {
  const selectedSymbol = useStore((s) => s.selectedSymbol);
  const tr = useT();

  const { data, isLoading, error } = useSWR<NewsItem[]>(
    selectedSymbol ? `/api/news?symbol=${encodeURIComponent(selectedSymbol)}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  const badge = data && data.length > 0 ? `${data.length} ${tr('newsUnit')}` : undefined;

  return (
    <Widget id="news" title={tr('newsTitle')} badge={badge}>
      {!selectedSymbol && (
        <div className="px-4 py-6 text-center text-text-muted text-sm font-sans">
          {tr('selectStockNews')}
        </div>
      )}

      {selectedSymbol && isLoading && <SkeletonNews />}

      {selectedSymbol && error && (
        <div className="px-4 py-4 text-center text-loss text-sm font-sans">
          {tr('newsError')}
        </div>
      )}

      {data && !isLoading && data.length === 0 && (
        <div className="px-4 py-6 text-center text-text-muted text-sm font-sans">
          {tr('noNews')}
        </div>
      )}

      {data && !isLoading && data.length > 0 && (
        <div className="p-3 space-y-2">
          {data.map((item, idx) => (
            <NewsCard key={`${item.publishedAt}-${idx}`} item={item} />
          ))}
        </div>
      )}
    </Widget>
  );
}
