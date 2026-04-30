'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  NAV_ITEMS,
  QUICKSTART_STEPS,
  INDICATORS,
  BUY_SIGNALS,
  SELL_SIGNALS,
  TIPS,
} from '@/lib/helpContent';
import type { Locale } from '@/lib/i18n';
import type { SignalDoc } from '@/lib/helpContent';

// ─── Primitives ──────────────────────────────────────────────────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-sans font-bold text-text-primary mb-5 pb-2 border-b border-border-subtle">
        {title}
      </h2>
      <div className="space-y-4 text-text-muted font-sans text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-mono font-bold text-white text-sm">
          {n}
        </div>
        <div className="w-px flex-1 bg-border-subtle mt-2" />
      </div>
      <div className="flex-1 pb-6">
        <p className="font-sans font-semibold text-text-primary mb-1.5">{title}</p>
        <div className="text-sm text-text-muted font-sans leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function IndicatorCard({
  name, params, placement, description,
}: {
  name: string; params: string; placement: string; description: string;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-panel p-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono font-bold text-accent text-sm">{name}</span>
        <span className="text-[10px] font-sans text-text-dim px-2 py-0.5 rounded bg-border-subtle shrink-0">{placement}</span>
      </div>
      <p className="text-[11px] font-mono text-text-dim mb-2">{params}</p>
      <p className="text-xs font-sans text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function SignalCard({ signal, locale }: { signal: SignalDoc; locale: Locale }) {
  const colors = {
    buy: 'border-gain/40 bg-gain/5',
    sell: 'border-loss/40 bg-loss/5',
    warning: 'border-yellow-500/40 bg-yellow-500/5',
  };
  const badgeColors = {
    buy: 'bg-gain text-white',
    sell: 'bg-loss text-white',
    warning: 'bg-yellow-500 text-black',
  };
  const arrows = { buy: '▲', sell: '▼', warning: '◆' };

  return (
    <div className={`rounded-lg border p-4 ${colors[signal.type]}`}>
      <div className="flex items-start gap-3">
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold ${badgeColors[signal.type]}`}>
          {arrows[signal.type]} {signal.rule}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-text-primary text-sm mb-1">{signal.label[locale]}</p>
          <p className="font-mono text-xs text-text-muted mb-2 leading-relaxed">{signal.condition[locale]}</p>
          <p className="text-xs text-text-muted leading-relaxed">{signal.meaning[locale]}</p>
        </div>
      </div>
    </div>
  );
}

function Callout({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'warn' | 'tip' }) {
  const styles = {
    info: 'border-accent/30 bg-accent/5',
    warn: 'border-yellow-500/40 bg-yellow-500/5',
    tip: 'border-gain/30 bg-gain/5',
  };
  const icons = {
    info: <path d="M7 3v4M7 9v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
    warn: <path d="M7 1L1 13h12L7 1zM7 5v4M7 11v.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />,
    tip: <path d="M7 1a5 5 0 0 1 2 9.5V12H5v-1.5A5 5 0 0 1 7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />,
  };
  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${styles[variant]}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5 text-text-muted">
        {icons[variant]}
      </svg>
      <div className="text-xs font-sans text-text-muted leading-relaxed">{children}</div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function HelpPage() {
  const [locale, setLocale] = useState<Locale>('ro');
  const L = locale;

  const UI = {
    title: { ro: 'Ghid complet de utilizare', en: 'Complete user guide' },
    subtitle: {
      ro: 'StockScope este o platformă de analiză tehnică și fundamentală a acțiunilor. Acest ghid explică pas cu pas toate funcționalitățile: grafice interactive, indicatori tehnici, semnale automate și personalizate de cumpărare/vânzare, date fundamentale și știri.',
      en: 'StockScope is a technical and fundamental stock analysis platform. This guide explains step by step all features: interactive charts, technical indicators, automatic and custom buy/sell signals, fundamentals and news.',
    },
    back: { ro: '← Înapoi la aplicație', en: '← Back to app' },
    guide: { ro: 'Ghid de Utilizare', en: 'User Guide' },
    startTour: { ro: 'Pornește turul interactiv', en: 'Start interactive tour' },
    tourNote: {
      ro: 'Turul interactiv evidențiază fiecare secțiune a aplicației cu o fereastră popup explicativă. Funcționează cel mai bine pe ecrane mari.',
      en: 'The interactive tour highlights each section of the app with an explanatory popup. Works best on large screens.',
    },
    crossoverDef: {
      ro: <>
        <strong className="text-text-primary">Definiție încrucișare (crossing):</strong> valoarea era strict {'<'} prag pe lumânarea N-1 și strict {'>'} prag pe lumânarea N.
        Nu se consideră o încrucișare dacă valoarea stă la același nivel sau sare direct fără a traversa. Această definiție strictă elimină semnalele false.
      </>,
      en: <>
        <strong className="text-text-primary">Crossing definition:</strong> the value was strictly {'<'} threshold on candle N-1 and strictly {'>'} threshold on candle N.
        It is not considered a crossing if the value stays at the same level or jumps without traversing. This strict definition eliminates false signals.
      </>,
    },
    customSignalsTitle: { ro: 'Semnale Personalizate', en: 'Custom Signals' },
    customSignalsIntro: {
      ro: 'Panoul Semnale Personalizate îți permite să construiești propriile reguli tehnice din dropdown-uri, fără a scrie cod. Regulile se salvează local în browser și se evaluează imediat pe datele reale ale oricărei acțiuni selectate.',
      en: 'The Custom Signals panel lets you build your own technical rules using dropdowns, without writing code. Rules are saved locally in the browser and evaluated immediately against real data for any selected stock.',
    },
    howToBuild: { ro: 'Cum construiești o regulă', en: 'How to build a rule' },
    buildSteps: {
      ro: [
        'Apasă „Adaugă semnal nou" în panoul Semnale Personalizate din dreapta aplicației.',
        'Dă un nume semnalului (ex: „Golden Cross RSI").',
        'Alege tipul de output: Cumpărare, Vânzare sau Avertisment.',
        'Configurează prima condiție: alege indicatorul din stânga (ex: RSI), operatorul (trece peste), tipul valorii (Valoare sau Indicator) și valoarea/indicatorul din dreapta (ex: 50).',
        'Opțional: apasă „+ Adaugă condiție (ȘI)" pentru a combina mai multe condiții — toate trebuie îndeplinite simultan pe aceeași lumânare.',
        'Apasă „Creează semnal". Semnalul apare imediat în lista de semnale dacă condiția se îndeplinește pe datele curente.',
      ],
      en: [
        'Click "Add new signal" in the Custom Signals panel on the right side of the app.',
        'Give the signal a name (e.g. "Golden Cross RSI").',
        'Choose the output type: Buy, Sell, or Warning.',
        'Configure the first condition: choose the left indicator (e.g. RSI), the operator (crosses above), the value type (Value or Indicator) and the right value/indicator (e.g. 50).',
        'Optional: click "+ Add condition (AND)" to combine multiple conditions — all must be met simultaneously on the same candle.',
        'Click "Create signal". The signal immediately appears in the signal list if the condition is met on current data.',
      ],
    },
    operators: { ro: 'Operatori disponibili', en: 'Available operators' },
    operatorList: {
      ro: [
        { op: 'trece peste', desc: 'Valoarea traversează pragul de jos în sus (încrucișare strictă)' },
        { op: 'trece sub', desc: 'Valoarea traversează pragul de sus în jos (încrucișare strictă)' },
        { op: 'este peste', desc: 'Valoarea este mai mare decât pragul/indicatorul (stare continuă)' },
        { op: 'este sub', desc: 'Valoarea este mai mică decât pragul/indicatorul (stare continuă)' },
      ],
      en: [
        { op: 'crosses above', desc: 'Value crosses the threshold from below (strict crossing)' },
        { op: 'crosses below', desc: 'Value crosses the threshold from above (strict crossing)' },
        { op: 'is above', desc: 'Value is greater than the threshold/indicator (continuous state)' },
        { op: 'is below', desc: 'Value is less than the threshold/indicator (continuous state)' },
      ],
    },
    exampleRules: { ro: 'Exemple de reguli', en: 'Example rules' },
    examples: {
      ro: [
        { name: 'RSI iese din supravânzare + confirmare MACD', conditions: 'RSI trece peste 30 ȘI Linie MACD este peste Semnal MACD', output: 'Cumpărare' },
        { name: 'Golden Cross simplu', conditions: 'EMA(50) trece peste EMA(200)', output: 'Cumpărare' },
        { name: 'Breakout cu volum', conditions: 'Preț este peste SMA(200) ȘI Volum este peste 0', output: 'Cumpărare' },
        { name: 'Death Cross avertisment', conditions: 'EMA(50) trece sub EMA(200)', output: 'Vânzare' },
      ],
      en: [
        { name: 'RSI exits oversold + MACD confirmation', conditions: 'RSI crosses above 30 AND MACD Line is above MACD Signal', output: 'Buy' },
        { name: 'Simple Golden Cross', conditions: 'EMA(50) crosses above EMA(200)', output: 'Buy' },
        { name: 'Breakout with volume', conditions: 'Price is above SMA(200) AND Volume is above 0', output: 'Buy' },
        { name: 'Death Cross warning', conditions: 'EMA(50) crosses below EMA(200)', output: 'Sell' },
      ],
    },
    manage: {
      ro: 'Gestionarea regulilor',
      en: 'Managing rules',
    },
    manageDesc: {
      ro: 'Fiecare regulă afișează un rezumat al condițiilor sale. Poți activa/dezactiva o regulă cu switch-ul din stânga fără a o șterge, o poți edita sau șterge complet. Regulile dezactivate nu generează semnale dar rămân salvate.',
      en: 'Each rule displays a summary of its conditions. You can enable/disable a rule with the toggle on the left without deleting it, edit it, or delete it entirely. Disabled rules generate no signals but remain saved.',
    },
    indicatorsTitle: { ro: 'Indicatori Tehnici', en: 'Technical Indicators' },
    indicatorsIntro: {
      ro: 'Indicatorii tehnici sunt calcule matematice aplicate pe istoricul de prețuri și volume. Fiecare poate fi activat sau dezactivat din bara de indicatori de deasupra graficului.',
      en: 'Technical indicators are mathematical calculations applied to price and volume history. Each can be enabled or disabled from the indicator bar above the chart.',
    },
    signalsTitle: { ro: 'Semnale Automate de Tranzacționare', en: 'Automatic Trading Signals' },
    signalsIntro: {
      ro: 'Semnalele sunt detectate automat pe baza regulilor tehnice definite, aplicând logica de încrucișare strictă. Sunt afișate cel mult 20 semnale recente. Semnalele apar pe grafic ca săgeți și în panoul din dreapta. Fă clic pe un semnal din listă pentru a naviga la acel moment — lumânarea se evidențiază cu o săgeată portocalie mai mare.',
      en: 'Signals are automatically detected based on defined technical rules, applying strict crossing logic. At most 20 recent signals are shown. Signals appear on the chart as arrows and in the right panel. Click a signal in the list to navigate to that moment — the candle highlights with a larger orange arrow.',
    },
    buySignals: { ro: 'Semnale de Cumpărare', en: 'Buy Signals' },
    sellSignals: { ro: 'Semnale de Vânzare', en: 'Sell Signals' },
    fundamentalsTitle: { ro: 'Date Fundamentale', en: 'Fundamentals' },
    fundamentalsIntro: {
      ro: 'Panoul Date Fundamentale afișează informații despre compania selectată, actualizate automat. Apasă „Vezi detalii complete" pentru a deschide un modal cu descrierea completă a companiei, toate metricile și știrile recente.',
      en: 'The Fundamentals panel displays information about the selected company, updated automatically. Press "View full details" to open a modal with the full company description, all metrics and recent news.',
    },
    metricsTitle: { ro: 'Metrici afișate', en: 'Displayed metrics' },
    metrics: {
      ro: [
        { label: 'Cap. de Piață', desc: 'Valoarea totală a companiei la prețul curent al acțiunii. Indicator al dimensiunii companiei.' },
        { label: 'Raport P/E', desc: 'Price-to-Earnings — de câte ori câștigul anual este inclus în prețul acțiunii. P/E ridicat poate indica supraevaluare sau așteptări mari de creștere.' },
        { label: 'EPS', desc: 'Earnings Per Share — profitul net împărțit la numărul de acțiuni. Indicator de profitabilitate per acțiune.' },
        { label: 'Dividend', desc: 'Randamentul dividendului anual față de prețul acțiunii. Relevant pentru investitorii orientați pe venit pasiv.' },
        { label: '52W High / Low', desc: 'Maximul și minimul prețului în ultimele 52 de săptămâni. Util pentru evaluarea poziției curente față de istoricul recent.' },
        { label: 'Rating Analiști', desc: 'Consensul analiștilor pe o scară de la 1 (Cumpărare Puternică) la 5 (Vânzare Puternică), bazat pe recomandările instituționale.' },
      ],
      en: [
        { label: 'Market Cap', desc: 'Total company value at current share price. Indicator of company size.' },
        { label: 'P/E Ratio', desc: 'Price-to-Earnings — how many times annual earnings are priced in. High P/E may indicate overvaluation or high growth expectations.' },
        { label: 'EPS', desc: 'Earnings Per Share — net profit divided by share count. A per-share profitability metric.' },
        { label: 'Div Yield', desc: 'Annual dividend yield relative to share price. Relevant for income-oriented investors.' },
        { label: '52W High / Low', desc: 'Maximum and minimum price over the last 52 weeks. Useful for evaluating the current position against recent history.' },
        { label: 'Analyst Rating', desc: 'Analyst consensus on a scale from 1 (Strong Buy) to 5 (Strong Sell), based on institutional recommendations.' },
      ],
    },
    watchlistTitle: { ro: 'Lista de Urmărire (Watchlist)', en: 'Watchlist' },
    watchlistBody: {
      ro: [
        { label: 'Adăugare', desc: 'După selectarea unei acțiuni, apasă „Adaugă la Liste" din bara laterală sau „Urmărește" din bara de deasupra graficului.' },
        { label: 'Selectare rapidă', desc: 'Fă clic pe orice rând din watchlist pentru a încărca imediat acea acțiune.' },
        { label: 'Prețuri live', desc: 'Fiecare acțiune afișează prețul curent și variația zilnică, actualizate la 30 de secunde în orele de tranzacționare.' },
        { label: 'Eliminare', desc: 'Apasă butonul ✕ de lângă simbol pentru a scoate acțiunea din listă.' },
        { label: 'Persistență', desc: 'Lista este salvată în localStorage — rămâne disponibilă la revenirea în aplicație, chiar după închiderea browserului.' },
      ],
      en: [
        { label: 'Adding', desc: 'After selecting a stock, press "Add to Watchlist" in the sidebar or "Watch" in the bar above the chart.' },
        { label: 'Quick selection', desc: 'Click any row in the watchlist to immediately load that stock.' },
        { label: 'Live prices', desc: 'Each stock shows the current price and daily change, updated every 30 seconds during trading hours.' },
        { label: 'Removal', desc: 'Press the ✕ button next to the symbol to remove the stock from the list.' },
        { label: 'Persistence', desc: 'The list is saved in localStorage — it remains available when you return to the app, even after closing the browser.' },
      ],
    },
    newsTitle: { ro: 'Știri Inteligente', en: 'Smart News' },
    newsBody: {
      ro: 'Panoul Știri afișează cele mai recente 10 articole legate de acțiunea selectată. Fiecare articol are un badge de sentiment (POZITIV / NEGATIV / NEUTRU). Apasă pe orice card pentru a deschide sertarul de detalii — nu mai ești redirecționat la o pagină externă.',
      en: 'The News panel displays the 10 most recent articles for the selected stock. Each article has a sentiment badge (POSITIVE / NEGATIVE / NEUTRAL). Click any card to open the details drawer — you are no longer redirected to an external page.',
    },
    newsDrawerTitle: { ro: 'Sertarul de știri', en: 'News drawer' },
    newsDrawerBody: {
      ro: [
        { label: 'Thumbnail + titlu', desc: 'Imaginea de copertă și titlul complet al articolului.' },
        { label: 'Sursă & dată', desc: 'Publicația sursă și momentul publicării.' },
        { label: 'Analiză AI', desc: 'Sugestie automată BUY / SELL / HOLD cu nivel de încredere HIGH / MEDIUM / LOW și o explicație în limbaj natural a cuvintelor cheie detectate.' },
        { label: 'Disclaimer', desc: 'Avertisment că sugestia este generată automat din titlu și nu constituie consiliere financiară.' },
        { label: 'Citește articolul complet', desc: 'Buton care deschide articolul original în browser, pentru a citi textul integral.' },
      ],
      en: [
        { label: 'Thumbnail + title', desc: 'Cover image and full article title.' },
        { label: 'Source & date', desc: 'Publishing outlet and publication time.' },
        { label: 'AI Analysis', desc: 'Automatic BUY / SELL / HOLD suggestion with HIGH / MEDIUM / LOW confidence and a plain-language explanation of the detected keywords.' },
        { label: 'Disclaimer', desc: 'Warning that the suggestion is auto-generated from the headline and does not constitute financial advice.' },
        { label: 'Read full article', desc: 'Button that opens the original article in the browser to read the full text.' },
      ],
    },
    tipsTitle: { ro: 'Sfaturi Practice', en: 'Practical Tips' },
    disclaimer: {
      ro: <>
        <strong className="text-text-primary">StockScope este exclusiv în scop informativ.</strong>{' '}
        Semnalele generate automat nu constituie consiliere financiară, recomandare de investiție sau îndemnuri de cumpărare/vânzare.
        Performanțele trecute nu garantează rezultate viitoare. Investițiile pe piețele financiare implică riscuri semnificative,
        inclusiv pierderea capitalului investit. Consultați un consilier financiar autorizat înainte de a lua orice decizie de investiție.
      </>,
      en: <>
        <strong className="text-text-primary">StockScope is for informational purposes only.</strong>{' '}
        Automatically generated signals do not constitute financial advice, investment recommendations, or buy/sell solicitations.
        Past performance does not guarantee future results. Investments in financial markets involve significant risks,
        including loss of invested capital. Consult a licensed financial advisor before making any investment decision.
      </>,
    },
    disclaimerTitle: { ro: '⚠ Disclaimer important', en: '⚠ Important disclaimer' },
    panelsTitle: { ro: 'Panouri Laterale', en: 'Side Panels' },
    panelsIntro: {
      ro: 'Coloana din dreapta afișează patru panouri independente: Semnale de Tranzacționare, Semnale Personalizate, Date Fundamentale și Știri. Fiecare panou poate fi restrâns sau extins cu clic pe titlu sau pe săgeata din dreapta.',
      en: 'The right column shows four independent panels: Trading Signals, Custom Signals, Fundamentals and News. Each panel can be collapsed or expanded by clicking its title or the chevron on the right.',
    },
    panelsBody: {
      ro: [
        { label: 'Restrângere / extindere', desc: 'Apasă titlul panoului sau săgeata (▾) pentru a-l restrânge. Un panou extins are o înălțime minimă de 400px; dacă conținutul depășește ecranul, coloana devine derulabilă.' },
        { label: 'Gestionare vizibilitate', desc: 'Iconița de setări (⚙) din antetul coloanei deschide un meniu cu checkboxuri — poți ascunde sau afișa orice panou după preferință. Setările sunt salvate local.' },
        { label: 'Derulare coloană', desc: 'Dacă toate panourile sunt extinse și depășesc înălțimea ecranului, coloana devine derulabilă independent față de grafic.' },
      ],
      en: [
        { label: 'Collapse / expand', desc: 'Click the panel title or the chevron (▾) to collapse it. An expanded panel has a minimum height of 400px; if the combined content exceeds the screen, the column becomes scrollable.' },
        { label: 'Visibility management', desc: 'The settings icon (⚙) in the column header opens a menu with checkboxes — you can hide or show any panel as needed. Settings are saved locally.' },
        { label: 'Column scroll', desc: 'When all panels are expanded and exceed the screen height, the column scrolls independently from the chart.' },
      ],
    },
    quickstartTitle: { ro: 'Pornire Rapidă — Pas cu Pas', en: 'Quick Start — Step by Step' },
    chartTitle: { ro: 'Graficul', en: 'Chart' },
    chartBody: {
      ro: <>
        <p>Graficul principal afișează prețul sub formă de lumânări japoneze (<em>candlestick</em>). Fiecare lumânare reprezintă o perioadă de timp.</p>
        <ul className="mt-3 space-y-1.5 list-none">
          <li><span className="text-gain font-mono text-xs">■ Verde</span> — prețul de închidere {'>'} deschidere (sesiune pozitivă)</li>
          <li><span className="text-loss font-mono text-xs">■ Roșu</span> — prețul de închidere {'<'} deschidere (sesiune negativă)</li>
          <li><strong className="text-text-primary">Corp</strong> = interval deschidere–închidere · <strong className="text-text-primary">Fitile</strong> = maxim și minim</li>
          <li><strong className="text-text-primary">Scroll</strong> = zoom · <strong className="text-text-primary">Drag</strong> = navigare în timp · <strong className="text-text-primary">Crosshair</strong> = valori OHLCV exacte</li>
          <li>Intervalele 1D și 5D afișează <strong className="text-text-primary">lumânări orare</strong> pentru granularitate mai mare</li>
          <li>Indicatorii RSI, MACD, Volum, Stochastic, ATR apar în sub-panouri <strong className="text-text-primary">sincronizate</strong> sub graficul principal</li>
        </ul>
      </>,
      en: <>
        <p>The main chart displays price as Japanese candlesticks. Each candle represents a time period.</p>
        <ul className="mt-3 space-y-1.5 list-none">
          <li><span className="text-gain font-mono text-xs">■ Green</span> — close price {'>'} open (positive session)</li>
          <li><span className="text-loss font-mono text-xs">■ Red</span> — close price {'<'} open (negative session)</li>
          <li><strong className="text-text-primary">Body</strong> = open–close range · <strong className="text-text-primary">Wicks</strong> = high and low</li>
          <li><strong className="text-text-primary">Scroll</strong> = zoom · <strong className="text-text-primary">Drag</strong> = navigate through time · <strong className="text-text-primary">Crosshair</strong> = exact OHLCV values</li>
          <li>1D and 5D timeframes display <strong className="text-text-primary">hourly candles</strong> for finer granularity</li>
          <li>RSI, MACD, Volume, Stochastic, ATR appear in <strong className="text-text-primary">synchronized</strong> sub-panels below the main chart</li>
        </ul>
      </>,
    },
  };

  return (
    <div className="min-h-screen bg-navy text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-panel border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 10l3-4 2 2 3-5 2 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-sans font-bold text-text-primary text-base">StockScope</span>
            </Link>
            <span className="text-border-subtle hidden sm:block">/</span>
            <span className="font-sans text-text-muted text-sm hidden sm:block truncate">{UI.guide[L]}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* RO/EN toggle */}
            <div className="flex rounded border border-border-subtle overflow-hidden">
              {(['ro', 'en'] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold transition-colors ${
                    locale === loc
                      ? 'bg-accent text-white'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/" className="text-xs font-sans text-accent hover:underline hidden sm:block">
              {UI.back[L]}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex gap-10">
        {/* Sticky sidebar nav */}
        <nav className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-0.5">
            {NAV_ITEMS.map(({ href, ro, en }) => (
              <a
                key={href}
                href={href}
                className="block px-3 py-1.5 rounded text-xs font-sans text-text-muted hover:text-text-primary hover:bg-panel-hover transition-colors"
              >
                {L === 'ro' ? ro : en}
              </a>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-14">

          {/* ── Intro ── */}
          <section id="intro" className="scroll-mt-24">
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 mb-6">
              <h1 className="text-2xl font-sans font-bold text-text-primary mb-2">
                {UI.title[L]}
              </h1>
              <p className="text-text-muted font-sans text-sm leading-relaxed">
                {UI.subtitle[L]}
              </p>
            </div>

            {/* Interactive tour CTA */}
            <div className="rounded-lg border border-border-subtle bg-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-sans font-semibold text-text-primary text-sm mb-1">
                  {L === 'ro' ? 'Tur interactiv al aplicației' : 'Interactive app tour'}
                </p>
                <p className="text-xs font-sans text-text-muted">{UI.tourNote[L]}</p>
              </div>
              <Link
                href="/"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-sans rounded-lg hover:bg-accent/80 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <polygon points="2,1 11,6 2,11" fill="currentColor" />
                </svg>
                {UI.startTour[L]}
              </Link>
            </div>
          </section>

          {/* ── Quick start ── */}
          <Section id="quickstart" title={UI.quickstartTitle[L]}>
            {QUICKSTART_STEPS.map((step, i) => (
              <Step key={i} n={i + 1} title={step.title[L]}>
                {step.body[L]}
              </Step>
            ))}
          </Section>

          {/* ── Panels ── */}
          <Section id="panels" title={UI.panelsTitle[L]}>
            <p>{UI.panelsIntro[L]}</p>
            <ul className="space-y-2 mt-3">
              {UI.panelsBody[L].map(({ label, desc }) => (
                <li key={label}>
                  <strong className="text-text-primary">{label}:</strong>{' '}
                  <span className="text-text-muted">{desc}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── Chart ── */}
          <Section id="chart" title={UI.chartTitle[L]}>
            {UI.chartBody[L]}
          </Section>

          {/* ── Indicators ── */}
          <Section id="indicators" title={UI.indicatorsTitle[L]}>
            <p>{UI.indicatorsIntro[L]}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {INDICATORS.map((ind) => (
                <IndicatorCard
                  key={ind.name}
                  name={ind.name}
                  params={ind.params}
                  placement={ind.placement[L]}
                  description={ind.description[L]}
                />
              ))}
            </div>
          </Section>

          {/* ── Signals intro ── */}
          <Section id="signals" title={UI.signalsTitle[L]}>
            <p>{UI.signalsIntro[L]}</p>
            <Callout variant="info">{UI.crossoverDef[L]}</Callout>
          </Section>

          {/* ── Buy signals ── */}
          <Section id="buy-signals" title={UI.buySignals[L]}>
            <div className="space-y-3">
              {BUY_SIGNALS.map((sig) => (
                <SignalCard key={sig.rule} signal={sig} locale={L} />
              ))}
            </div>
          </Section>

          {/* ── Sell signals ── */}
          <Section id="sell-signals" title={UI.sellSignals[L]}>
            <div className="space-y-3">
              {SELL_SIGNALS.map((sig) => (
                <SignalCard key={sig.rule} signal={sig} locale={L} />
              ))}
            </div>
          </Section>

          {/* ── Custom signals ── */}
          <Section id="custom-signals" title={UI.customSignalsTitle[L]}>
            <p>{UI.customSignalsIntro[L]}</p>

            <div>
              <h3 className="font-sans font-semibold text-text-primary text-base mb-3">{UI.howToBuild[L]}</h3>
              <ol className="space-y-2">
                {UI.buildSteps[L].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-text-muted">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-sans font-semibold text-text-primary text-base mb-3">{UI.operators[L]}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {UI.operatorList[L].map(({ op, desc }) => (
                  <div key={op} className="rounded-lg border border-border-subtle bg-panel p-3">
                    <p className="font-mono text-xs text-accent font-semibold mb-1">{op}</p>
                    <p className="text-xs text-text-muted font-sans leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-sans font-semibold text-text-primary text-base mb-3">{UI.exampleRules[L]}</h3>
              <div className="space-y-2">
                {UI.examples[L].map((ex, i) => (
                  <div key={i} className="rounded-lg border border-border-subtle bg-panel p-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-semibold text-text-primary mb-0.5">{ex.name}</p>
                      <p className="text-xs font-mono text-text-dim truncate">{ex.conditions}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      ex.output === 'Cumpărare' || ex.output === 'Buy'
                        ? 'bg-gain/20 text-gain'
                        : 'bg-loss/20 text-loss'
                    }`}>
                      {ex.output}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-sans font-semibold text-text-primary text-base mb-2">{UI.manage[L]}</h3>
              <p className="text-sm text-text-muted">{UI.manageDesc[L]}</p>
            </div>

            <Callout variant="tip">
              {L === 'ro'
                ? 'Combină condiții de „încrucișare" cu condiții de „stare" pentru reguli mai precise. De exemplu: EMA(50) trece peste EMA(200) ȘI RSI este peste 50 — astfel confirmi că momentumul susține breakout-ul.'
                : 'Combine "crossing" conditions with "state" conditions for more precise rules. For example: EMA(50) crosses above EMA(200) AND RSI is above 50 — this confirms that momentum supports the breakout.'}
            </Callout>
          </Section>

          {/* ── Fundamentals ── */}
          <Section id="fundamentals" title={UI.fundamentalsTitle[L]}>
            <p>{UI.fundamentalsIntro[L]}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {UI.metrics[L].map(({ label, desc }) => (
                <div key={label} className="rounded-lg border border-border-subtle bg-panel p-3">
                  <p className="font-mono text-xs text-accent font-semibold mb-1">{label}</p>
                  <p className="text-xs text-text-muted font-sans leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Watchlist ── */}
          <Section id="watchlist" title={UI.watchlistTitle[L]}>
            <ul className="space-y-2">
              {UI.watchlistBody[L].map(({ label, desc }) => (
                <li key={label}>
                  <strong className="text-text-primary">{label}:</strong>{' '}
                  <span className="text-text-muted">{desc}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── News ── */}
          <Section id="news" title={UI.newsTitle[L]}>
            <p>{UI.newsBody[L]}</p>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-gain font-mono text-xs font-semibold">
                {L === 'ro' ? 'POZITIV' : 'POSITIVE'}
              </span>
              <span className="text-text-dim">·</span>
              <span className="text-loss font-mono text-xs font-semibold">
                {L === 'ro' ? 'NEGATIV' : 'NEGATIVE'}
              </span>
              <span className="text-text-dim">·</span>
              <span className="text-text-muted font-mono text-xs font-semibold">
                {L === 'ro' ? 'NEUTRU' : 'NEUTRAL'}
              </span>
            </div>

            <h3 className="font-sans font-semibold text-text-primary text-base mt-5 mb-3">
              {UI.newsDrawerTitle[L]}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {UI.newsDrawerBody[L].map(({ label, desc }) => (
                <div key={label} className="rounded-lg border border-border-subtle bg-panel p-3">
                  <p className="font-mono text-xs text-accent font-semibold mb-1">{label}</p>
                  <p className="text-xs text-text-muted font-sans leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <Callout variant="warn">
              {L === 'ro'
                ? 'Sugestia BUY / SELL / HOLD este generată automat din cuvintele cheie ale titlului și nu constituie consiliere financiară. Folosiți-o ca un indiciu contextual, nu ca bază de decizie.'
                : 'The BUY / SELL / HOLD suggestion is auto-generated from headline keywords and does not constitute financial advice. Use it as contextual color, not a decision basis.'}
            </Callout>
          </Section>

          {/* ── Tips ── */}
          <Section id="tips" title={UI.tipsTitle[L]}>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="rounded-lg border border-border-subtle bg-panel p-4">
                  <p className="font-sans font-semibold text-text-primary text-sm mb-1">{tip.title[L]}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{tip.body[L]}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Disclaimer ── */}
          <section id="disclaimer" className="scroll-mt-24">
            <div className="rounded-xl border border-loss/30 bg-loss/5 p-5">
              <h2 className="text-sm font-sans font-bold text-loss uppercase tracking-wide mb-2">
                {UI.disclaimerTitle[L]}
              </h2>
              <p className="text-sm font-sans text-text-muted leading-relaxed">
                {UI.disclaimer[L]}
              </p>
            </div>
          </section>

        </main>
      </div>

      <footer className="border-t border-border-subtle bg-panel mt-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs font-sans text-text-dim">
            {L === 'ro'
              ? 'Doar în scop informativ. Nu constituie consiliere financiară. Datele de piață au o întârziere de 15 minute.'
              : 'For informational purposes only. Not financial advice. Market data delayed 15 minutes.'}
          </p>
          <Link href="/" className="text-xs font-sans text-accent hover:underline">
            {UI.back[L]}
          </Link>
        </div>
      </footer>
    </div>
  );
}
