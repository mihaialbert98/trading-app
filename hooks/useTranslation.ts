'use client';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store';

export function useTranslatedText(text: string | null | undefined): {
  translated: string | null;
  isTranslating: boolean;
} {
  const locale = useStore((s) => s.locale);
  const [translatedRo, setTranslatedRo] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const lastTextRef = useRef<string | null>(null);

  useEffect(() => {
    const src = text?.trim() ?? '';
    if (!src || locale === 'en') return;

    // Skip if we already have a translation for this exact text
    if (lastTextRef.current === src && translatedRo !== null) return;

    lastTextRef.current = src;
    setIsTranslating(true);
    const controller = new AbortController();

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: src, target: 'ro' }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: { translated?: string }) => {
        setTranslatedRo(data.translated ?? src);
      })
      .catch(() => setTranslatedRo(src))
      .finally(() => setIsTranslating(false));

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, locale]);

  if (!text?.trim()) return { translated: null, isTranslating: false };
  if (locale === 'en') return { translated: text, isTranslating: false };
  return { translated: translatedRo, isTranslating };
}
