import { useState, useEffect } from 'react';
import useSWR from 'swr';
import type { SearchResult } from '@/types/stock';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Search failed');
  return res.json() as Promise<SearchResult[]>;
});

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim(), 300);

  const { data, isLoading, error } = useSWR<SearchResult[]>(
    debouncedQuery.length >= 1 ? `/api/search?q=${encodeURIComponent(debouncedQuery)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    results: data ?? [],
    isLoading: debouncedQuery.length >= 1 && isLoading,
    error: error as Error | null,
  };
}
