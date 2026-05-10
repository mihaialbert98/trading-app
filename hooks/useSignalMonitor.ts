'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { isMarketHours } from '@/lib/market';
import type { SignalEvent } from '@/types/signals';

interface HistoryResponse {
  signals: SignalEvent[];
}

export function useSignalMonitor() {
  const watchlist = useStore((s) => s.watchlist);
  const addNotification = useStore((s) => s.addNotification);
  const seenRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  // Request notification permission on first render
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (watchlist.length === 0) return;

    async function check(seed: boolean) {
      if (!seed && !isMarketHours()) return;
      for (const { symbol } of watchlist) {
        try {
          const res = await fetch(
            `/api/history?symbol=${encodeURIComponent(symbol)}&interval=1d&range=3mo`
          );
          if (!res.ok) continue;
          const data = (await res.json()) as HistoryResponse;
          for (const signal of data.signals ?? []) {
            const key = `${symbol}:${signal.rule}:${signal.timestamp}`;
            if (!seenRef.current.has(key)) {
              seenRef.current.add(key);
              if (!seed) {
                const title = `${signal.type.replace(/_/g, ' ')} — ${symbol}`;
                const body = signal.description;
                // Push to in-app notification bell
                addNotification({ symbol, title, body });
                // Fire OS notification if permitted
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification(title, { body, icon: '/favicon.ico' });
                }
              }
            }
          }
        } catch {
          // ignore per-symbol errors
        }
      }
      initializedRef.current = true;
    }

    if (!initializedRef.current) {
      check(true);
    }

    const id = setInterval(() => check(false), 60_000);
    return () => clearInterval(id);
  }, [watchlist, addNotification]);
}
