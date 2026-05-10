export interface ChangeEntry {
  version: string;
  date: string;
  tag: 'feature' | 'fix' | 'improvement';
  title: { ro: string; en: string };
  items: { ro: string; en: string }[];
}

export const CHANGELOG: ChangeEntry[] = [
  {
    version: '1.7.0',
    date: '2026-05-10',
    tag: 'feature',
    title: {
      ro: 'Notificări în timp real, intervale 1H/4H și pagina Changelog',
      en: 'Real-time notifications, 1H/4H timeframes and Changelog page',
    },
    items: [
      {
        ro: 'Adăugat clopotul de notificări (🔔) în bara laterală — afișează semnalele noi detectate pe acțiunile din watchlist, cu badge roșu pentru necitite',
        en: 'Added notification bell (🔔) in the sidebar — shows new signals detected on watchlist stocks, with red badge for unread',
      },
      {
        ro: 'Monitorizare automată a watchlist-ului la fiecare 60 de secunde în orele de piață — notificări browser (push) pentru semnale noi',
        en: 'Automatic watchlist monitoring every 60 seconds during market hours — browser push notifications for new signals',
      },
      {
        ro: 'Adăugat intervalul 1H (lumânări orare, viewport ultimele 7 zile)',
        en: 'Added 1H timeframe (hourly candles, last 7 days viewport)',
      },
      {
        ro: 'Adăugat intervalul 4H — lumânări agregate client-side din date orare (4×1h), viewport ultimele 30 de zile',
        en: 'Added 4H timeframe — candles aggregated client-side from hourly data (4×1h), last 30 days viewport',
      },
      {
        ro: 'Crosshair sincronizat între graficul principal și toate sub-panourile (RSI, MACD, Volum, Stochastic, ATR)',
        en: 'Crosshair synchronized across the main chart and all sub-panels (RSI, MACD, Volume, Stochastic, ATR)',
      },
      {
        ro: 'Culorile liniilor de referință RSI devin distincte: roșu (#EF4444) la 70, gri (#94a3b8) la 50, verde (#22C55E) la 30',
        en: 'RSI reference line colors are now distinct: red (#EF4444) at 70, grey (#94a3b8) at 50, green (#22C55E) at 30',
      },
      {
        ro: 'Vizualizarea 1D preia 5 zile de date orare pentru a asigura încălzirea MACD și RSI — semnalele apar corect pe timeframe-ul 1D',
        en: '1D view fetches 5 days of hourly data to ensure MACD and RSI warm-up — signals now appear correctly on the 1D timeframe',
      },
      {
        ro: 'Intervalul 4h mapat la 1h în apelul API (Yahoo Finance nu oferă interval nativ de 4h) — agregarea se face client-side',
        en: '4h interval mapped to 1h in the API call (Yahoo Finance has no native 4h interval) — aggregation is done client-side',
      },
      {
        ro: 'Extrasă logica isMarketHours() în lib/market.ts — reutilizată de useStockData și useSignalMonitor',
        en: 'Extracted isMarketHours() logic into lib/market.ts — reused by useStockData and useSignalMonitor',
      },
      {
        ro: 'Adăugat viewDays în store — permite afișarea unui subset al datelor descărcate (ex: 1D afișează doar ultima zi din 5 descărcate)',
        en: 'Added viewDays to the store — allows displaying a subset of fetched data (e.g. 1D shows only the last day out of 5 fetched)',
      },
      {
        ro: 'Adăugată pagina /changelog cu istoricul complet al versiunilor, bilingv RO/EN, nav lateral și tag-uri Feature/Fix/Îmbunătățire',
        en: 'Added /changelog page with full version history, bilingual RO/EN, sidebar nav and Feature/Fix/Improvement tags',
      },
      {
        ro: 'Link către /changelog adăugat în footer-ul aplicației principale și în pagina de ajutor',
        en: 'Link to /changelog added in the main app footer and in the help page',
      },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-05-10',
    tag: 'feature',
    title: {
      ro: 'Notificări în timp real și intervale 1H / 4H',
      en: 'Real-time notifications and 1H / 4H timeframes',
    },
    items: [
      {
        ro: 'Adăugat clopotul de notificări (🔔) în bara laterală — afișează semnalele noi detectate pe acțiunile din watchlist',
        en: 'Added notification bell (🔔) in the sidebar — shows new signals detected on watchlist stocks',
      },
      {
        ro: 'Notificările browser (push) se activează automat la adăugarea primei acțiuni în watchlist',
        en: 'Browser push notifications are activated automatically when adding the first stock to the watchlist',
      },
      {
        ro: 'Adăugat intervalul 1H (lumânări orare, ultimele 7 zile)',
        en: 'Added 1H timeframe (hourly candles, last 7 days)',
      },
      {
        ro: 'Adăugat intervalul 4H (lumânări de 4 ore, agregate client-side din date orare, ultimele 30 de zile)',
        en: 'Added 4H timeframe (4-hour candles aggregated client-side from hourly data, last 30 days)',
      },
      {
        ro: 'Crosshair sincronizat între graficul principal și toate sub-panourile (RSI, MACD, Volum etc.)',
        en: 'Crosshair synchronized across the main chart and all sub-panels (RSI, MACD, Volume etc.)',
      },
      {
        ro: 'Culorile liniilor de referință RSI devin distincte: roșu la 70 (supracumpărat), gri la 50 (mijloc), verde la 30 (supravândut)',
        en: 'RSI reference line colors are now distinct: red at 70 (overbought), grey at 50 (midline), green at 30 (oversold)',
      },
      {
        ro: 'Vizualizarea 1D preia acum 5 zile de date orare pentru a asigura încălzirea indicatorilor (MACD, RSI) — semnalele apar corect pe timeframe-ul 1D',
        en: '1D view now fetches 5 days of hourly data to ensure indicator warm-up (MACD, RSI) — signals now appear correctly on the 1D timeframe',
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-05-01',
    tag: 'feature',
    title: {
      ro: 'Scroll înapoi în timp și gestionare îmbunătățită a erorilor',
      en: 'Scroll-back in time and improved error handling',
    },
    items: [
      {
        ro: 'Implementat scroll înapoi în timp — graficul încarcă automat date istorice suplimentare când ajungi la marginea stângă',
        en: 'Implemented scroll-back in time — the chart automatically loads additional historical data when you reach the left edge',
      },
      {
        ro: 'Indicatorii (RSI, MACD, EMA etc.) sunt recalculați client-side pe datele îmbinate atunci când există date prepend-uite',
        en: 'Indicators (RSI, MACD, EMA etc.) are recomputed client-side on merged data when prepended historical data exists',
      },
      {
        ro: 'Rezolvat problema cu indicatorii care dispăreau la schimbarea intervalului de timp',
        en: 'Fixed indicators disappearing when switching timeframes',
      },
      {
        ro: 'Rezolvat scroll-ul infinit în viitor (graficul nu mai poate fi derulat dincolo de ultima lumânare)',
        en: 'Fixed infinite scroll into the future (chart can no longer be scrolled past the last candle)',
      },
      {
        ro: 'Adăugat stare de eroare cu buton „Încearcă din nou" în grafic',
        en: 'Added error state with "Try again" button in the chart',
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-05-01',
    tag: 'feature',
    title: {
      ro: 'Sertarul de știri cu analiză AI și ghid actualizat',
      en: 'News drawer with AI analysis and updated help guide',
    },
    items: [
      {
        ro: 'Clic pe orice știre deschide un sertar lateral cu thumbnail, sursă, dată, analiză AI (BUY/SELL/HOLD) și link la articolul complet',
        en: 'Clicking any news article opens a side drawer with thumbnail, source, date, AI analysis (BUY/SELL/HOLD) and link to full article',
      },
      {
        ro: 'Analiza AI afișează nivel de încredere (HIGH / MEDIUM / LOW) și explicație în limbaj natural',
        en: 'AI analysis shows confidence level (HIGH / MEDIUM / LOW) and plain-language explanation',
      },
      {
        ro: 'Actualizat ghidul de utilizare cu secțiunile „Știri Inteligente" și „Panouri Laterale"',
        en: 'Updated the help guide with "Smart News" and "Side Panels" sections',
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-05-01',
    tag: 'improvement',
    title: {
      ro: 'Polling optimizat pentru orele de piață',
      en: 'Optimized polling for market hours',
    },
    items: [
      {
        ro: 'Quote-urile live se actualizează la 30 de secunde în orele de tranzacționare (09:30–16:00 ET, Luni–Vineri)',
        en: 'Live quotes update every 30 seconds during trading hours (09:30–16:00 ET, Monday–Friday)',
      },
      {
        ro: 'Polling-ul se oprește automat în afara orelor de piață pentru a reduce cererile inutile',
        en: 'Polling stops automatically outside market hours to reduce unnecessary requests',
      },
      {
        ro: 'Extratat utilitarul isMarketHours() în lib/market.ts — reutilizat în toate hook-urile relevante',
        en: 'Extracted isMarketHours() utility into lib/market.ts — reused across all relevant hooks',
      },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-04-30',
    tag: 'feature',
    title: {
      ro: 'Sistem de widget-uri cu panouri colapsabile',
      en: 'Widget system with collapsible panels',
    },
    items: [
      {
        ro: 'Coloana din dreapta conține acum patru panouri independente: Semnale, Semnale Personalizate, Fundamentale, Știri',
        en: 'The right column now contains four independent panels: Signals, Custom Signals, Fundamentals, News',
      },
      {
        ro: 'Fiecare panou poate fi restrâns/extins cu clic pe titlu sau pe săgeata din dreapta',
        en: 'Each panel can be collapsed/expanded by clicking its title or the chevron on the right',
      },
      {
        ro: 'Meniu de vizibilitate (⚙) — poți ascunde sau afișa orice panou; preferințele se salvează local',
        en: 'Visibility menu (⚙) — hide or show any panel; preferences are saved locally',
      },
      {
        ro: 'Coloana devine derulabilă independent față de grafic când conținutul depășește ecranul',
        en: 'The column scrolls independently from the chart when content exceeds the screen height',
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-04-30',
    tag: 'improvement',
    title: {
      ro: 'Refactorizare layout și îmbunătățiri UI',
      en: 'Layout refactor and UI improvements',
    },
    items: [
      {
        ro: 'Optimizare responsivitate — bara laterală devine un sertar bottom-sheet pe mobile',
        en: 'Responsiveness optimization — sidebar becomes a bottom-sheet drawer on mobile',
      },
      {
        ro: 'Bara QuoteBar (simbol, preț, variație) deasupra graficului afișează acum exchange-ul și butonul Watch',
        en: 'QuoteBar (symbol, price, change) above the chart now shows the exchange and Watch button',
      },
      {
        ro: 'Tur interactiv ghidat — evidențiază pas cu pas fiecare secțiune a aplicației',
        en: 'Guided interactive tour — step-by-step highlights of each app section',
      },
      {
        ro: 'Adăugat ghidul complet de utilizare accesibil din footer',
        en: 'Added full user guide accessible from the footer',
      },
    ],
  },
  {
    version: '1.0.1',
    date: '2026-04-30',
    tag: 'feature',
    title: {
      ro: 'Logo companie și modal detalii',
      en: 'Company logo and details modal',
    },
    items: [
      {
        ro: 'Logo-ul companiei apare în panoul Fundamentale cu fallback la inițiale colorate',
        en: 'Company logo appears in the Fundamentals panel with colored initials fallback',
      },
      {
        ro: 'Butonul „Vezi detalii complete" deschide un modal cu profilul complet, toate metricile și știrile recente',
        en: '"View full details" button opens a modal with full company profile, all metrics and recent news',
      },
      {
        ro: 'Suport multilingv (RO/EN) pentru toate etichetele din modal',
        en: 'Multilingual support (RO/EN) for all modal labels',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-04-30',
    tag: 'feature',
    title: {
      ro: 'Lansare inițială StockScope',
      en: 'Initial StockScope release',
    },
    items: [
      {
        ro: 'Grafic candlestick interactiv (TradingView Lightweight Charts) cu zoom și navigare în timp',
        en: 'Interactive candlestick chart (TradingView Lightweight Charts) with zoom and time navigation',
      },
      {
        ro: 'Indicator tehnici: RSI(14), MACD(12,26,9), Bollinger Bands, EMA, SMA, Volum, Stochastic, ATR — toate toggle-abile',
        en: 'Technical indicators: RSI(14), MACD(12,26,9), Bollinger Bands, EMA, SMA, Volume, Stochastic, ATR — all toggleable',
      },
      {
        ro: 'Motor de semnale automate: 4 semnale BUY (B1–B4) și 3 semnale SELL (S1–S3) cu logică de încrucișare strictă',
        en: 'Automatic signal engine: 4 BUY signals (B1–B4) and 3 SELL signals (S1–S3) with strict crossing logic',
      },
      {
        ro: 'Constructor de semnale personalizate — creează reguli proprii din dropdown-uri fără cod',
        en: 'Custom signal builder — create your own rules from dropdowns without code',
      },
      {
        ro: 'Watchlist cu prețuri live și persistență în localStorage',
        en: 'Watchlist with live prices and localStorage persistence',
      },
      {
        ro: 'Panoul Fundamentale: profil companie, metrici cheie, rating analiști',
        en: 'Fundamentals panel: company profile, key metrics, analyst rating',
      },
      {
        ro: 'Feed de știri cu badge de sentiment (POZITIV / NEGATIV / NEUTRU)',
        en: 'News feed with sentiment badge (POSITIVE / NEGATIVE / NEUTRAL)',
      },
      {
        ro: 'Selector de interval temporal: 1H, 4H, 1D, 5D, 1M, 3M, 6M, 1Y, 5Y',
        en: 'Timeframe selector: 1H, 4H, 1D, 5D, 1M, 3M, 6M, 1Y, 5Y',
      },
      {
        ro: 'Temă dark/light toggle, suport multilingv RO/EN',
        en: 'Dark/light theme toggle, RO/EN multilingual support',
      },
    ],
  },
];
