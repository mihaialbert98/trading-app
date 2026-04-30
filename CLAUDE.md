# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build
npm run lint       # ESLint
npm run type-check # tsc --noEmit (add to package.json scripts)
npm test           # Jest
npm test -- --testPathPattern=<file>  # Run a single test file
```

---

## Project Overview

A professional web application for technical and fundamental stock analysis. Users can search for any publicly traded stock, visualize price charts with configurable indicators (RSI, MACD, Bollinger Bands, etc.), receive buy/sell signals based on pre-defined rules, and read AI-summarized fundamental news for the selected company.

**Stack**: Next.js 14+ (App Router) · TypeScript strict · Tailwind CSS v3 · `yahoo-finance2`  
**No separate backend** — all data fetching happens via Next.js API routes in `app/api/`.  
**Deployment**: Vercel

---

## Agents

Two sub-agents exist in `.claude/agents/`:

- **`quant.md`** — owns all math/data logic: indicator calculations, signal engine, API routes, Yahoo Finance adapter
- **`ui.md`** — owns all React components, pages, charts, hooks, and styling

---

## Architecture

All data flows server-side through Next.js API routes — no direct Yahoo Finance calls from the browser. The frontend uses SWR to fetch from these routes.

**State management**: Zustand store holds selected ticker, watchlist, active indicators, and theme.

**Indicator pipeline**: Raw OHLCV data → `lib/indicators/` pure functions → typed arrays → chart overlay or sub-panel. All computations for large datasets (5Y daily) happen server-side in the API route, not client-side.

**Signal engine**: `lib/signals/buy-signals.ts` and `sell-signals.ts` consume indicator output arrays. All crossing checks use `lib/utils/crossover.ts` — never bare threshold comparisons.

**Live quote polling**: every 30 seconds during market hours (09:30–16:00 ET, Mon–Fri); stop polling outside hours.

---

## Signal Rules (Source of Truth)

**Implement these exactly. Do not deviate.**

### BUY Signals

| ID | Condition | Label |
|----|-----------|-------|
| B1 | RSI(14) crosses **above 20** | Strong BUY — oversold recovery |
| B2 | RSI(14) crosses **above 50** | Moderate BUY — momentum confirmation |
| B3 | MACD line crosses above Signal line AND MACD histogram turns positive (MACD > 0) | BUY |
| B4 | Price touches lower Bollinger Band AND RSI < 35 | Oversold BUY (bonus) |

### SELL Signals

| ID | Condition | Label |
|----|-----------|-------|
| S1 | RSI(14) crosses **below 70** AND MACD crosses **below 0** (within 2-candle window) | Strong SELL |
| S2 | MACD line crosses below Signal line while RSI > 60 | Early SELL Warning (bonus) |
| S3 | Price crosses below 20-day EMA after 2+ consecutive down candles | Trend SELL (bonus) |

> **Crossing definition**: value was strictly `<` threshold on candle N-1 AND strictly `>` on candle N. Use `crossover.ts` for all crossing checks. S1 requires both conditions on the same candle or within a 2-candle window.

---

## Technical Indicators

| Indicator | Default Params | Chart Placement |
|-----------|---------------|-----------------|
| RSI | Period: 14 | Sub-panel, reference lines at 30 / 50 / 70 |
| MACD | Fast: 12, Slow: 26, Signal: 9 | Sub-panel with histogram |
| Bollinger Bands | Period: 20, StdDev: 2 | Overlay on main chart |
| EMA | 9, 21, 50, 200 (user-selectable) | Overlay on main chart |
| SMA | 50, 200 (user-selectable) | Overlay on main chart |
| Volume | Raw bars + 20-day avg line | Sub-panel |
| Stochastic | %K: 14, %D: 3, Smooth: 3 | Sub-panel (optional toggle) |
| ATR | Period: 14 | Sub-panel (optional toggle) |

All indicators are toggleable — none hardwired to always show.

---

## Data Source: Yahoo Finance

Use `yahoo-finance2` (Node.js, no API key required).

| Data needed | Method |
|-------------|--------|
| Ticker search / autocomplete | `yf.search(query)` |
| Live quote | `yf.quote(symbol)` |
| OHLCV history | `yf.historical(symbol, { period1, period2, interval })` |
| Company profile + metrics | `yf.quoteSummary(symbol, { modules: ['assetProfile', 'financialData', 'defaultKeyStatistics', 'recommendationTrend'] })` |
| News | `yf.search(symbol, { newsCount: 10 })` |

**Supported intervals**: `1d`, `1wk`, `1mo` (stable). Intraday `1m`–`1h` available for last 60 days only.

**Caching**: cache API responses in-memory or with Next.js `revalidate` — never call Yahoo Finance on every keystroke.

### Fallback APIs (if Yahoo Finance rate-limits)

| Provider | Free tier | Use case |
|----------|-----------|----------|
| Alpha Vantage | 25 req/day | EOD historical data |
| Polygon.io | 5 req/min | US stocks, real-time |
| Finnhub | 60 req/min | News + fundamentals |
| Twelve Data | 800 req/day | WebSocket real-time |

---

## Fundamental Analysis

When a stock is selected, fetch and display alongside the chart:

1. **Company profile** — sector, industry, country, short description (truncated to 120 words)
2. **Key metrics** — Market Cap, P/E ratio, EPS, 52-week high/low, dividend yield
3. **Analyst consensus** — `recommendationMean` + `numberOfAnalystOpinions` from `quoteSummary`
4. **Recent news** — last 5–10 articles: title, source, published date, thumbnail, sentiment badge (POSITIVE / NEGATIVE / NEUTRAL)

---

## Hard Rules

**Quant layer:**
- Never round intermediate values — preserve full float precision until display layer
- All indicator functions must be pure: accept raw `OHLCV[]`, return typed arrays of the same length (use `null` for warm-up periods)
- No `any` types

**UI layer:**
- All numbers displayed via `Intl.NumberFormat` — never raw `.toString()` on prices
- Every API call must have loading / error / empty state in the UI
- Never hardcode ticker symbols or company names — always dynamic from API
- Mobile-responsive: chart collapses to full-width on small screens, sidebar becomes a bottom drawer
- No `any` types

---

## Design Direction

- **Aesthetic**: Dark-first. Bloomberg Terminal meets modern SaaS. Deep navy/charcoal backgrounds, electric blue accent (`#0EA5E9`), sharp contrast.
- **Typography**: `IBM Plex Mono` for all numbers, ticker symbols, OHLCV values. `Syne` or `DM Sans` for UI labels and headings. No Inter, no Roboto, no system fonts.
- **Gain/loss colors**: `#22C55E` (gain) / `#EF4444` (loss)
- **Signals**: Green `▲` for BUY markers, red `▼` for SELL markers on chart. Latest signal gets an animated pulse.
- **Search dropdown**: Shows ticker symbol, company name, exchange badge, country flag emoji.
- **Layout**: Left sidebar (search + watchlist) · Main chart area · Right panel (signals log + fundamentals + news).

---

## Shared TypeScript Types

```typescript
// types/stock.ts
export interface OHLCV {
  timestamp: number; // Unix ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  currency: string;
  exchange: string;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  country: string;
  description: string;
  peRatio: number | null;
  eps: number | null;
  marketCap: number | null;
  week52High: number | null;
  week52Low: number | null;
  dividendYield: number | null;
  analystRating: number | null; // recommendationMean: 1=Strong Buy, 5=Strong Sell
  analystCount: number | null;
}

// types/signals.ts
export type SignalType = 'STRONG_BUY' | 'BUY' | 'SELL' | 'STRONG_SELL' | 'WARNING';

export interface SignalEvent {
  timestamp: number;
  type: SignalType;
  rule: 'B1' | 'B2' | 'B3' | 'B4' | 'S1' | 'S2' | 'S3';
  price: number;
  description: string;
}
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_APP_NAME="StockScope"

# Fallback APIs — optional, only if Yahoo Finance rate-limits
ALPHA_VANTAGE_API_KEY=
POLYGON_API_KEY=
FINNHUB_API_KEY=
```

---

## MVP Checklist

- [ ] Search bar with autocomplete (yahoo-finance2 search)
- [ ] Candlestick chart (TradingView Lightweight Charts)
- [ ] RSI(14) sub-panel with 30/50/70 reference lines
- [ ] MACD(12,26,9) sub-panel with histogram
- [ ] Buy/sell signal markers on chart
- [ ] Signal log panel (recent signals with timestamp + price + rule ID)
- [ ] Timeframe selector (1D · 1W · 1M · 3M · 6M · 1Y · 5Y)
- [ ] Indicator toggle panel
- [ ] Fundamentals panel (profile + key metrics + analyst rating)
- [ ] News feed with sentiment badge
- [ ] Watchlist (localStorage)
- [ ] Dark/light theme toggle
- [ ] Disclaimer footer: "For informational purposes only. Not financial advice."
