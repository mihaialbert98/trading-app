import { useStore } from '@/store';

export type Locale = 'ro' | 'en';

export const t: Record<string, Record<Locale, string>> = {
  // SearchBar
  searchPlaceholder: { ro: 'Caută simbol sau companie…', en: 'Search ticker or company…' },
  searchFailed: { ro: 'Căutare eșuată. Încearcă din nou.', en: 'Search failed. Please try again.' },
  noResults: { ro: 'Niciun rezultat pentru', en: 'No results for' },
  // StockChart
  loadingChart: { ro: 'Se încarcă graficul…', en: 'Loading chart…' },
  noStockSelected: { ro: 'Nicio acțiune selectată', en: 'No stock selected' },
  searchSidebarHint: {
    ro: 'Caută un simbol bursier în bara laterală pentru a încărca graficul',
    en: 'Search for a ticker symbol in the sidebar to load the chart',
  },
  chartError: { ro: 'Eroare la încărcarea graficului', en: 'Failed to load chart' },
  noChartData: { ro: 'Nu există date disponibile', en: 'No chart data available' },
  watch: { ro: 'Urmărește', en: 'Watch' },
  watching: { ro: 'Urmărit', en: 'Watching' },
  // Page
  addToList: { ro: 'Adaugă la Liste', en: 'Add to Watchlist' },
  searchMobile: { ro: 'Caută', en: 'Search' },
  close: { ro: 'Închide', en: 'Close' },
  disclaimer: {
    ro: 'Doar în scop informativ. Nu constituie consiliere financiară. Datele de piață au o întârziere de 15 minute.',
    en: 'For informational purposes only. Not financial advice. Market data delayed 15 minutes.',
  },
  helpLink: { ro: 'Ghid de utilizare', en: 'User guide' },
  // SignalLog
  signalLogTitle: { ro: 'Semnale de Tranzacționare', en: 'Trading Signals' },
  signalUnit: { ro: 'semnale', en: 'signals' },
  selectStockSignals: {
    ro: 'Selectează o acțiune pentru a vedea semnalele',
    en: 'Select a stock to view signals',
  },
  signalError: { ro: 'Eroare la încărcarea semnalelor', en: 'Failed to load signals' },
  noSignals: { ro: 'Niciun semnal detectat', en: 'No signals detected' },
  // FundamentalsPanel
  fundamentalsTitle: { ro: 'Date Fundamentale', en: 'Fundamentals' },
  selectStockFundamentals: {
    ro: 'Selectează o acțiune pentru date fundamentale',
    en: 'Select a stock to view fundamentals',
  },
  fundamentalsError: { ro: 'Eroare la încărcarea datelor', en: 'Failed to load fundamentals' },
  marketCap: { ro: 'Cap. de Piață', en: 'Market Cap' },
  peRatio: { ro: 'Raport P/E', en: 'P/E Ratio' },
  eps: { ro: 'EPS', en: 'EPS' },
  dividend: { ro: 'Dividend', en: 'Div Yield' },
  week52High: { ro: '52S Maxim', en: '52W High' },
  week52Low: { ro: '52S Minim', en: '52W Low' },
  analystRating: { ro: 'Rating Analiști', en: 'Analyst Rating' },
  strongBuyLabel: { ro: 'Cump. Puternică', en: 'Strong Buy' },
  strongSellLabel: { ro: 'Vânz. Puternică', en: 'Strong Sell' },
  basedOn: { ro: 'Bazat pe', en: 'Based on' },
  analystOpinion: { ro: 'opinie de analist', en: 'analyst opinion' },
  analystOpinions: { ro: 'opinii de analist', en: 'analyst opinions' },
  expandDetails: { ro: 'Detalii', en: 'Details' },
  descriptionTranslated: { ro: '(tradus automat)', en: '' },
  translating: { ro: 'Se traduce…', en: '' },
  // NewsPanel
  newsTitle: { ro: 'Știri', en: 'News' },
  newsUnit: { ro: 'articole', en: 'articles' },
  selectStockNews: {
    ro: 'Selectează o acțiune pentru știri',
    en: 'Select a stock to view news',
  },
  newsError: { ro: 'Eroare la încărcarea știrilor', en: 'Failed to load news' },
  noNews: { ro: 'Nu există știri recente', en: 'No recent news available' },
  // NewsDrawer
  aiAnalysis: { ro: 'Analiză AI', en: 'AI Analysis' },
  aiSuggestion: { ro: 'Sugestie', en: 'Suggestion' },
  aiConfidence: { ro: 'Încredere', en: 'Confidence' },
  confidenceHigh: { ro: 'Ridicată', en: 'High' },
  confidenceMedium: { ro: 'Medie', en: 'Medium' },
  confidenceLow: { ro: 'Scăzută', en: 'Low' },
  aiDisclaimer: {
    ro: 'Această sugestie este generată automat pe baza titlului articolului și nu constituie consiliere financiară. Fă-ți propriile cercetări înainte de a lua orice decizie de investiție.',
    en: 'This suggestion is generated automatically based on the article headline and does not constitute financial advice. Do your own research before making any investment decision.',
  },
  aiKeywordsFound: { ro: 'Cuvinte cheie detectate', en: 'Keywords detected' },
  readFullArticle: { ro: 'Citește articolul complet', en: 'Read full article' },
  suggestionBuy: { ro: '▲ CUMPĂRARE', en: '▲ BUY' },
  suggestionSell: { ro: '▼ VÂNZARE', en: '▼ SELL' },
  suggestionHold: { ro: '— NEUTRU', en: '— HOLD' },
  // Watchlist
  watchlistTitle: { ro: 'Listă de Urmărire', en: 'Watchlist' },
  watchlistEmpty: {
    ro: 'Caută o acțiune și adaug-o la lista de urmărire',
    en: 'Search for a stock and add it to your watchlist',
  },
  // IndicatorToggle
  indicatorsLabel: { ro: 'Indicatori:', en: 'Indicators:' },
  // SignalBadge labels
  strongBuy: { ro: 'CUMP. PUTERNICĂ', en: 'STRONG BUY' },
  buy: { ro: 'CUMPĂRARE', en: 'BUY' },
  sell: { ro: 'VÂNZARE', en: 'SELL' },
  strongSell: { ro: 'VÂNZ. PUTERNICĂ', en: 'STRONG SELL' },
  warning: { ro: 'AVERTISMENT', en: 'WARNING' },
  // Sentiment
  positive: { ro: 'POZITIV', en: 'POSITIVE' },
  negative: { ro: 'NEGATIV', en: 'NEGATIVE' },
  neutral: { ro: 'NEUTRU', en: 'NEUTRAL' },
  // AnalystRating labels
  ratingStrongBuy: { ro: 'Cumpărare Puternică', en: 'Strong Buy' },
  ratingBuy: { ro: 'Cumpărare', en: 'Buy' },
  ratingHold: { ro: 'Neutru', en: 'Hold' },
  ratingSell: { ro: 'Vânzare', en: 'Sell' },
  ratingStrongSell: { ro: 'Vânzare Puternică', en: 'Strong Sell' },
  // Modal
  modalClose: { ro: 'Închide', en: 'Close' },
  modalNewsSection: { ro: 'Știri recente', en: 'Recent news' },
  modalDescription: { ro: 'Despre companie', en: 'About the company' },
  modalKeyMetrics: { ro: 'Indicatori cheie', en: 'Key metrics' },
};

// Signal descriptions map (rule → locale → label)
export const signalDescriptions: Record<string, Record<Locale, string>> = {
  B1: {
    ro: 'Cumpărare Puternică — revenire din supravânzare',
    en: 'Strong BUY — oversold recovery',
  },
  B2: {
    ro: 'Cumpărare Moderată — confirmare momentum',
    en: 'Moderate BUY — momentum confirmation',
  },
  B3: {
    ro: 'Cumpărare — încrucișare MACD bullish',
    en: 'BUY — MACD bullish crossover',
  },
  B4: {
    ro: 'Cumpărare — atingere Bollinger inferior',
    en: 'Oversold BUY — Bollinger touch',
  },
  B5: { ro: 'Cumpărare — MACD trece peste zero', en: 'BUY — MACD zero-line crossover' },
  S1: { ro: 'Vânzare Puternică', en: 'Strong SELL' },
  S2: { ro: 'Avertisment Timpuriu de Vânzare', en: 'Early SELL Warning' },
  S3: { ro: 'Vânzare pe Trend', en: 'Trend SELL' },
  S4: { ro: 'Vânzare — MACD trece sub zero', en: 'SELL — MACD zero-line crossover' },
  // DonationBanner
  donationMessage: {
    ro: 'StockScope este gratuit și rămâne gratuit. Dacă îți este de folos, poți cumpăra o cafea. ☕',
    en: 'StockScope is free and will stay free. If it helps you, consider buying me a coffee. ☕',
  },
  donationCta: { ro: 'Suportă proiectul', en: 'Support the project' },
};

// Hook to get translator
export function useT() {
  const locale = useStore((s) => s.locale);
  return (key: keyof typeof t): string => t[key]?.[locale] ?? t[key]?.['en'] ?? String(key);
}
