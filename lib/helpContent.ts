import type { Locale } from '@/lib/i18n';

export interface NavItem {
  href: string;
  ro: string;
  en: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '#intro',         ro: 'Introducere',            en: 'Introduction' },
  { href: '#quickstart',    ro: 'Pornire rapidă',         en: 'Quick start' },
  { href: '#chart',         ro: 'Graficul',               en: 'Chart' },
  { href: '#indicators',    ro: 'Indicatori tehnici',     en: 'Technical indicators' },
  { href: '#signals',       ro: 'Semnale automate',       en: 'Automatic signals' },
  { href: '#buy-signals',   ro: '  Cumpărare',            en: '  Buy signals' },
  { href: '#sell-signals',  ro: '  Vânzare',              en: '  Sell signals' },
  { href: '#custom-signals',ro: '  Semnale personalizate',en: '  Custom signals' },
  { href: '#fundamentals',  ro: 'Date fundamentale',      en: 'Fundamentals' },
  { href: '#watchlist',     ro: 'Lista de urmărire',      en: 'Watchlist' },
  { href: '#news',          ro: 'Știri',                  en: 'News' },
  { href: '#tips',          ro: 'Sfaturi practice',       en: 'Practical tips' },
  { href: '#disclaimer',    ro: 'Disclaimer',             en: 'Disclaimer' },
];

export interface StepContent {
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}

export const QUICKSTART_STEPS: StepContent[] = [
  {
    title: { ro: 'Caută o acțiune', en: 'Search for a stock' },
    body: {
      ro: 'Folosește bara de căutare din stânga pentru a găsi orice acțiune listată pe bursele internaționale. Introdu simbolul bursier (ex: AAPL, MSFT) sau numele companiei. Rezultatele apar automat cu logo, bursă și țara de origine.',
      en: 'Use the search bar on the left to find any publicly traded stock. Enter the ticker symbol (e.g. AAPL, MSFT) or company name. Results appear automatically with logo, exchange and country.',
    },
  },
  {
    title: { ro: 'Selectează acțiunea', en: 'Select the stock' },
    body: {
      ro: 'Fă clic pe rezultatul dorit din dropdown. Graficul, semnalele, datele fundamentale și știrile se încarcă automat pentru acțiunea selectată.',
      en: 'Click the desired result in the dropdown. The chart, signals, fundamentals, and news all load automatically for the selected stock.',
    },
  },
  {
    title: { ro: 'Alege intervalul de timp', en: 'Choose the timeframe' },
    body: {
      ro: 'Folosește butoanele 1D · 5D · 1M · 3M · 6M · 1Y · 5Y din bara de deasupra graficului. Vizualizările 1D și 5D afișează lumânări orare pentru granularitate mai mare. Perioade mai lungi (1Y, 5Y) oferă semnale mai fiabile.',
      en: 'Use the 1D · 5D · 1M · 3M · 6M · 1Y · 5Y buttons above the chart. 1D and 5D views show hourly candles for finer granularity. Longer periods (1Y, 5Y) provide more reliable signals.',
    },
  },
  {
    title: { ro: 'Activează indicatorii doriți', en: 'Enable desired indicators' },
    body: {
      ro: 'Butonele de lângă selectorul de timp îți permit să activezi sau dezactivezi fiecare indicator tehnic. Indicatorii activi sunt evidențiați cu albastru. Indicatorii RSI, MACD, Volum, Stochastic și ATR apar în sub-panouri sincronizate sub grafic. Bollinger Bands, EMA și SMA se suprapun pe graficul principal.',
      en: 'The buttons next to the timeframe selector let you enable or disable each technical indicator. Active indicators are highlighted in blue. RSI, MACD, Volume, Stochastic and ATR appear in synchronized sub-panels below the chart. Bollinger Bands, EMA and SMA overlay the main chart.',
    },
  },
  {
    title: { ro: 'Citește și interacționează cu semnalele', en: 'Read and interact with signals' },
    body: {
      ro: 'Panoul Semnale de Tranzacționare din dreapta afișează toate semnalele detectate, de la cel mai recent. Semnalele apar și pe grafic ca săgeți. Fă clic pe orice semnal din listă pentru a naviga la acel moment pe grafic — acesta va fi evidențiat cu o linie verticală albastră.',
      en: 'The Trading Signals panel on the right shows all detected signals, newest first. Signals also appear on the chart as arrows. Click any signal in the list to navigate to that moment on the chart — it will be highlighted with a blue vertical line.',
    },
  },
  {
    title: { ro: 'Creează semnale personalizate', en: 'Create custom signals' },
    body: {
      ro: 'În panoul Semnale Personalizate poți construi propriile reguli tehnice din dropdown-uri. Alege un indicator, o condiție (trece peste / trece sub / este peste / este sub) și o valoare sau un alt indicator. Poți combina mai multe condiții cu AND. Regulile sunt salvate local și evaluate imediat pe date reale.',
      en: 'In the Custom Signals panel you can build your own technical rules using dropdowns. Choose an indicator, a condition (crosses above / crosses below / is above / is below) and a value or another indicator. You can combine multiple conditions with AND. Rules are saved locally and evaluated immediately on real data.',
    },
  },
];

export interface IndicatorDoc {
  name: string;
  params: string;
  placement: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const INDICATORS: IndicatorDoc[] = [
  {
    name: 'RSI',
    params: 'Period: 14',
    placement: { ro: 'Sub-panou', en: 'Sub-panel' },
    description: {
      ro: 'Relative Strength Index — măsoară viteza și amplitudinea mișcărilor de preț pe o scară 0–100. Valori sub 30 indică supravânzare (potențial semnal de cumpărare), valori peste 70 indică supracumpărare (potențial semnal de vânzare). Linii de referință la 30, 50 și 70.',
      en: 'Relative Strength Index — measures the speed and magnitude of price movements on a 0–100 scale. Values below 30 indicate oversold (potential buy signal), above 70 indicate overbought (potential sell signal). Reference lines at 30, 50 and 70.',
    },
  },
  {
    name: 'MACD',
    params: 'Fast: 12 · Slow: 26 · Signal: 9',
    placement: { ro: 'Sub-panou', en: 'Sub-panel' },
    description: {
      ro: 'Moving Average Convergence Divergence — diferența dintre două medii mobile exponențiale. Histograma verde/roșie arată forța trendului. Încrucișarea liniei MACD cu linia Signal generează semnale B3/S2. Trecerea prin zero generează semnalele B5/S4.',
      en: 'Moving Average Convergence Divergence — the difference between two exponential moving averages. The green/red histogram shows trend strength. The MACD line crossing the Signal line generates B3/S2 signals. Crossing through zero generates B5/S4 signals.',
    },
  },
  {
    name: 'Bollinger Bands',
    params: 'Period: 20 · StdDev: 2',
    placement: { ro: 'Overlay pe grafic', en: 'Chart overlay' },
    description: {
      ro: 'Trei linii suprapuse: banda superioară, media mobilă de 20 zile și banda inferioară, fiecare la 2 deviații standard față de medie. Când prețul atinge banda inferioară și RSI < 35, se activează semnalul B4. Benzile se îngustează în perioade de volatilitate scăzută (squeeze).',
      en: 'Three overlaid lines: upper band, 20-day moving average and lower band, each 2 standard deviations from the middle. When price touches the lower band and RSI < 35, signal B4 triggers. Bands narrow during low-volatility periods (squeeze).',
    },
  },
  {
    name: 'EMA',
    params: 'Periods: 9 · 21 · 50 · 200',
    placement: { ro: 'Overlay pe grafic', en: 'Chart overlay' },
    description: {
      ro: 'Medii Mobile Exponențiale — reacționează mai rapid la schimbările de preț decât SMA datorită ponderării mai mari a datelor recente. EMA 9/21 pentru trenduri pe termen scurt; EMA 50/200 pentru trenduri pe termen lung. Prețul peste EMA 200 = trend bullish general.',
      en: 'Exponential Moving Averages — react faster to price changes than SMA because they give more weight to recent data. EMA 9/21 for short-term trends; EMA 50/200 for long-term trends. Price above EMA 200 = overall bullish trend.',
    },
  },
  {
    name: 'SMA',
    params: 'Periods: 50 · 200',
    placement: { ro: 'Overlay pe grafic', en: 'Chart overlay' },
    description: {
      ro: 'Medii Mobile Simple — media aritmetică a prețurilor de închidere. SMA 200 este referința clasică pentru trendul pe termen lung. Încrucișarea SMA 50 peste SMA 200 (Golden Cross) este un semnal bullish clasic; invers (Death Cross) este bearish.',
      en: 'Simple Moving Averages — arithmetic mean of closing prices. SMA 200 is the classic reference for the long-term trend. SMA 50 crossing above SMA 200 (Golden Cross) is a classic bullish signal; the reverse (Death Cross) is bearish.',
    },
  },
  {
    name: 'Volume',
    params: 'Moving avg: 20 days',
    placement: { ro: 'Sub-panou', en: 'Sub-panel' },
    description: {
      ro: 'Numărul de acțiuni tranzacționate în fiecare sesiune. Bare verzi = sesiune pozitivă, roșii = negativă. Linia albastră = media pe 20 de zile. Volume mari confirmă puterea unui trend sau a unei rupturi de nivel; volume mici sugerează mișcări nesusținute.',
      en: 'Number of shares traded each session. Green bars = up session, red = down. Blue line = 20-day average. High volume confirms trend strength or breakouts; low volume suggests unsustained moves.',
    },
  },
  {
    name: 'Stochastic',
    params: '%K: 14 · %D: 3 · Smooth: 3',
    placement: { ro: 'Sub-panou', en: 'Sub-panel' },
    description: {
      ro: 'Oscilator care compară prețul de închidere cu intervalul high-low din ultimele n perioade. Valori sub 20 = supravânzare, peste 80 = supracumpărare. Linia %K (albastru) și %D (galben) — încrucișarea lor în zone extreme generează semnale de reversal.',
      en: 'Oscillator comparing close price to the high-low range over the last n periods. Values below 20 = oversold, above 80 = overbought. %K line (blue) and %D line (yellow) — their crossover in extreme zones generates reversal signals.',
    },
  },
  {
    name: 'ATR',
    params: 'Period: 14',
    placement: { ro: 'Sub-panou', en: 'Sub-panel' },
    description: {
      ro: 'Average True Range — măsoară volatilitatea medie a acțiunii (nu direcția). ATR în creștere = volatilitate ridicată. Util pentru setarea stop-loss-ului: un stop la 1–2× ATR sub prețul de intrare lasă spațiu pentru volatilitatea normală a acțiunii.',
      en: 'Average True Range — measures average price volatility (not direction). Rising ATR = high volatility. Useful for setting stop-losses: a stop at 1–2× ATR below entry price allows room for normal stock volatility.',
    },
  },
];

export interface SignalDoc {
  rule: string;
  type: 'buy' | 'sell' | 'warning';
  label: Record<Locale, string>;
  condition: Record<Locale, string>;
  meaning: Record<Locale, string>;
}

export const BUY_SIGNALS: SignalDoc[] = [
  {
    rule: 'B1',
    type: 'buy',
    label: { ro: 'Cumpărare Puternică — revenire din supravânzare', en: 'Strong Buy — oversold recovery' },
    condition: { ro: 'RSI(14) încrucișează în sus pragul 30', en: 'RSI(14) crosses above 30' },
    meaning: {
      ro: 'Acțiunea a fost în teritoriu de supravânzare (RSI sub 30) și acum revine. Este cel mai puternic semnal de cumpărare — indică o potențială inversare a trendului de scădere. Apare mai rar și merită atenție sporită.',
      en: 'The stock was in oversold territory (RSI below 30) and is now recovering. This is the strongest buy signal — it indicates a potential reversal of the downtrend. It appears less frequently and deserves extra attention.',
    },
  },
  {
    rule: 'B2',
    type: 'buy',
    label: { ro: 'Cumpărare Moderată — confirmare momentum', en: 'Moderate Buy — momentum confirmation' },
    condition: { ro: 'RSI(14) încrucișează în sus pragul 50 ȘI RSI era sub 40 în ultimele 5 lumânări', en: 'RSI(14) crosses above 50 AND RSI was below 40 within the last 5 candles' },
    meaning: {
      ro: 'RSI trece din zona negativă în cea pozitivă, confirmând că momentumul s-a schimbat în favoarea cumpărătorilor. Condiția de sub 40 recent filtrează semnalele false din piețele laterale.',
      en: 'RSI moves from negative to positive territory, confirming that momentum has shifted in favor of buyers. The recent below-40 condition filters false signals in sideways markets.',
    },
  },
  {
    rule: 'B3',
    type: 'buy',
    label: { ro: 'Cumpărare — încrucișare MACD bullish', en: 'Buy — MACD bullish crossover' },
    condition: { ro: 'Linia MACD încrucișează în sus linia Signal ȘI histograma devine pozitivă', en: 'MACD line crosses above Signal line AND histogram turns positive' },
    meaning: {
      ro: 'Dubla confirmare MACD: linia rapidă depășește linia lentă în timp ce histograma confirmă că impulsul este pozitiv. Indică accelerarea momentumului bullish. Unul dintre cele mai fiabile semnale MACD.',
      en: 'Double MACD confirmation: the fast line surpasses the slow line while the histogram confirms positive momentum. Indicates accelerating bullish momentum. One of the most reliable MACD signals.',
    },
  },
  {
    rule: 'B4',
    type: 'buy',
    label: { ro: 'Cumpărare — atingere Bollinger inferior', en: 'Buy — lower Bollinger touch' },
    condition: { ro: 'Prețul de închidere ≤ Banda Bollinger inferioară ȘI RSI < 35', en: 'Close price ≤ Lower Bollinger Band AND RSI < 35' },
    meaning: {
      ro: 'Prețul a atins sau depășit banda de devianță standard inferioară în timp ce RSI confirmă supravânzarea. Combinația crește probabilitatea unei reveniri spre medie. Poate apărea mai frecvent în trenduri puternice descendente — folosiți cu precauție.',
      en: 'Price has touched or breached the lower standard deviation band while RSI confirms oversold conditions. The combination increases the probability of a mean reversion. May appear more frequently in strong downtrends — use with caution.',
    },
  },
  {
    rule: 'B5',
    type: 'buy',
    label: { ro: 'Cumpărare — MACD trece peste zero', en: 'Buy — MACD zero-line crossover' },
    condition: { ro: 'Linia MACD încrucișează în sus pragul 0 ȘI linia MACD > linia Signal', en: 'MACD line crosses above 0 AND MACD line is above Signal line' },
    meaning: {
      ro: 'MACD intră în teritoriu pozitiv, confirmând că trendul pe termen mediu a trecut de la bearish la bullish. Condiția secundară (MACD > Signal) elimină intrările târzii când momentumul deja slăbește. Semnal de confirmare a trendului, nu de intrare timpurie.',
      en: 'MACD enters positive territory, confirming that the medium-term trend has shifted from bearish to bullish. The secondary condition (MACD > Signal) eliminates late entries when momentum is already fading. A trend confirmation signal, not an early entry.',
    },
  },
];

export const SELL_SIGNALS: SignalDoc[] = [
  {
    rule: 'S1',
    type: 'sell',
    label: { ro: 'Vânzare Puternică', en: 'Strong Sell' },
    condition: { ro: 'RSI(14) încrucișează în jos pragul 70 ȘI MACD încrucișează în jos linia Signal (în fereastra de 3 lumânări)', en: 'RSI(14) crosses below 70 AND MACD crosses below Signal line (within a 3-candle window)' },
    meaning: {
      ro: 'Cel mai puternic semnal de vânzare: acțiunea iese din zona de supracumpărare (RSI coboară sub 70) în timp ce MACD confirmă slăbirea momentumului bullish. Fereastra de 3 lumânări permite captarea situațiilor în care cele două condiții se materializează cu o ușoară decalare. Ambele trebuie prezente.',
      en: 'The strongest sell signal: the stock exits overbought territory (RSI drops below 70) while MACD confirms weakening bullish momentum. The 3-candle window captures situations where the two conditions materialize with a slight offset. Both must be present.',
    },
  },
  {
    rule: 'S2',
    type: 'warning',
    label: { ro: 'Avertisment Timpuriu de Vânzare', en: 'Early Sell Warning' },
    condition: { ro: 'Linia MACD încrucișează în jos linia Signal ȘI RSI > 60', en: 'MACD line crosses below Signal line AND RSI > 60' },
    meaning: {
      ro: 'Semnal de avertizare — nu o vânzare imediată, ci un semn că momentumul bullish slăbește în timp ce prețul este încă în teritoriu pozitiv. Poate precede o corecție. Util pentru reducerea parțială a poziției sau strângerea stop-loss-ului.',
      en: 'A warning signal — not an immediate sell, but a sign that bullish momentum is weakening while price is still in positive territory. May precede a correction. Useful for partially reducing position or tightening a stop-loss.',
    },
  },
  {
    rule: 'S3',
    type: 'sell',
    label: { ro: 'Vânzare pe Trend', en: 'Trend Sell' },
    condition: { ro: 'Prețul încrucișează în jos EMA 20 ȘI precedat de 2+ lumânări consecutive descendente', en: 'Price crosses below EMA 20 AND preceded by 2+ consecutive down candles' },
    meaning: {
      ro: 'Prețul pierde suportul mediei mobile de 20 de zile după două sesiuni consecutive negative, confirmând că trendul pe termen scurt s-a inversat. Combinația dintre ruptura EMA și presiunea vânzătorilor pe 2 zile consecutive semnalează continuarea scăderii.',
      en: 'Price loses the 20-day moving average support after two consecutive negative sessions, confirming the short-term trend has reversed. The combination of the EMA break and 2-day seller pressure signals further decline.',
    },
  },
  {
    rule: 'S4',
    type: 'sell',
    label: { ro: 'Vânzare — MACD trece sub zero', en: 'Sell — MACD zero-line crossover' },
    condition: { ro: 'Linia MACD încrucișează în jos pragul 0 ȘI linia MACD < linia Signal', en: 'MACD line crosses below 0 AND MACD line is below Signal line' },
    meaning: {
      ro: 'MACD intră în teritoriu negativ, confirmând că trendul pe termen mediu a trecut de la bullish la bearish. Condiția secundară (MACD < Signal) elimină semnalele false când momentumul bearish nu este confirmat. Semnal de confirmare a trendului descendent.',
      en: 'MACD enters negative territory, confirming that the medium-term trend has shifted from bullish to bearish. The secondary condition (MACD < Signal) eliminates false signals when bearish momentum is not confirmed. A downtrend confirmation signal.',
    },
  },
];

export interface TipDoc {
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}

export const TIPS: TipDoc[] = [
  {
    title: { ro: 'Folosește perioade mai lungi pentru semnale mai fiabile', en: 'Use longer timeframes for more reliable signals' },
    body: {
      ro: 'Pe intervale de 1M sau 3M cu date zilnice, semnalele sunt mai frecvente dar pot fi mai zgomotoase. Pe 1Y sau 5Y cu date săptămânale sau lunare, semnalele sunt mai rare dar au semnificație statistică mai mare.',
      en: 'On 1M or 3M intervals with daily data, signals are more frequent but noisier. On 1Y or 5Y with weekly or monthly data, signals are rarer but carry greater statistical significance.',
    },
  },
  {
    title: { ro: 'Combină mai mulți indicatori', en: 'Combine multiple indicators' },
    body: {
      ro: 'Un semnal B3 (MACD) apărut în același timp cu RSI în teritoriu pozitiv și prețul peste EMA 50 are o probabilitate mai mare de succes decât un semnal izolat. Nu lua decizii bazate pe un singur indicator — caută confluența mai multor semnale.',
      en: 'A B3 signal (MACD) occurring alongside RSI in positive territory and price above EMA 50 has a higher probability of success than an isolated signal. Never base decisions on a single indicator — look for confluence across multiple signals.',
    },
  },
  {
    title: { ro: 'ATR pentru dimensionarea riscului', en: 'ATR for risk sizing' },
    body: {
      ro: 'Dacă ATR-ul unei acțiuni este de 5 USD, un stop-loss la 1–2× ATR (5–10 USD sub prețul de intrare) este un nivel rezonabil care lasă spațiu pentru volatilitatea normală fără a fi oprit prematur.',
      en: 'If a stock\'s ATR is $5, a stop-loss at 1–2× ATR ($5–10 below entry) is a reasonable level that leaves room for normal volatility without being stopped out prematurely.',
    },
  },
  {
    title: { ro: 'Semnalele personalizate — sfaturi de construcție', en: 'Custom signals — building tips' },
    body: {
      ro: 'Combinați condiții de "încrucișare" (crosses above/below) cu condiții de "stare" (is above/below) pentru reguli mai precise. De exemplu: MACD trece peste Signal ȘI RSI este peste 50 — astfel filtrați semnalele care apar în trenduri bearish.',
      en: 'Combine "crossing" conditions (crosses above/below) with "state" conditions (is above/below) for more precise rules. For example: MACD crosses above Signal AND RSI is above 50 — this filters out signals occurring during bearish trends.',
    },
  },
  {
    title: { ro: 'Datele au întârziere de 15 minute', en: 'Data is delayed 15 minutes' },
    body: {
      ro: 'Datele de piață afișate au o întârziere de aproximativ 15 minute față de prețul real. Polling-ul live actualizează cotațiile la fiecare 30 de secunde în orele de tranzacționare (9:30–16:00 ET), dar nu înlocuiește un feed în timp real.',
      en: 'Market data displayed is delayed approximately 15 minutes from the real price. Live polling updates quotes every 30 seconds during trading hours (9:30–16:00 ET), but does not replace a real-time feed.',
    },
  },
];
