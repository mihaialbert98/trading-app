import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ghid de Utilizare — StockScope',
  description: 'Cum să folosești StockScope: grafice, indicatori tehnici, semnale de tranzacționare și date fundamentale.',
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-xl font-sans font-bold text-text-primary mb-4 pb-2 border-b border-border-subtle">
        {title}
      </h2>
      <div className="space-y-4 text-text-muted font-sans text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-sans font-semibold text-text-primary mb-2">{title}</h3>
      <div className="space-y-2 text-text-muted font-sans text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function SignalCard({
  rule,
  type,
  label,
  condition,
  meaning,
}: {
  rule: string;
  type: 'buy' | 'sell' | 'warning';
  label: string;
  condition: string;
  meaning: string;
}) {
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
  const arrows = {
    buy: '▲',
    sell: '▼',
    warning: '◆',
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[type]}`}>
      <div className="flex items-start gap-3">
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold ${badgeColors[type]}`}>
          {arrows[type]} {rule}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-text-primary text-sm mb-1">{label}</p>
          <p className="font-mono text-xs text-text-muted mb-2 leading-relaxed">{condition}</p>
          <p className="text-xs text-text-muted leading-relaxed">{meaning}</p>
        </div>
      </div>
    </div>
  );
}

function IndicatorCard({
  name,
  params,
  placement,
  description,
}: {
  name: string;
  params: string;
  placement: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono font-bold text-accent text-sm">{name}</span>
        <span className="text-[10px] font-sans text-text-dim px-2 py-0.5 rounded bg-border-subtle">{placement}</span>
      </div>
      <p className="text-xs font-mono text-text-muted mb-1">{params}</p>
      <p className="text-xs font-sans text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center font-mono font-bold text-white text-sm">
        {n}
      </div>
      <div className="flex-1 pb-6 border-b border-border-subtle last:border-0">
        <p className="font-sans font-semibold text-text-primary mb-1">{title}</p>
        <div className="text-sm text-text-muted font-sans leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-navy text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-panel border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 10l3-4 2 2 3-5 2 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-sans font-bold text-text-primary text-base">StockScope</span>
            </Link>
            <span className="text-border-subtle">/</span>
            <span className="font-sans text-text-muted text-sm">Ghid de Utilizare</span>
          </div>
          <Link
            href="/"
            className="text-xs font-sans text-accent hover:underline flex items-center gap-1"
          >
            ← Înapoi la aplicație
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex gap-10">
        {/* Sidebar nav */}
        <nav className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-1">
            {[
              { href: '#introducere', label: 'Introducere' },
              { href: '#pornire', label: 'Cum să începi' },
              { href: '#grafic', label: 'Graficul' },
              { href: '#indicatori', label: 'Indicatori Tehnici' },
              { href: '#semnale', label: 'Semnale' },
              { href: '#semnale-cumparare', label: '  Cumpărare' },
              { href: '#semnale-vanzare', label: '  Vânzare' },
              { href: '#fundamentale', label: 'Date Fundamentale' },
              { href: '#watchlist', label: 'Lista de Urmărire' },
              { href: '#stiri', label: 'Știri' },
              { href: '#sfaturi', label: 'Sfaturi practice' },
              { href: '#disclaimer', label: 'Disclaimer' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block px-3 py-1.5 rounded text-xs font-sans text-text-muted hover:text-text-primary hover:bg-panel-hover transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-12">

          {/* Intro */}
          <section id="introducere">
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 mb-8">
              <h1 className="text-2xl font-sans font-bold text-text-primary mb-2">
                Ghid complet de utilizare StockScope
              </h1>
              <p className="text-text-muted font-sans text-sm leading-relaxed">
                StockScope este o platformă de analiză tehnică și fundamentală a acțiunilor. Acest ghid îți explică
                pas cu pas cum să folosești toate funcționalitățile: grafice interactive, indicatori tehnici,
                semnale automate de cumpărare și vânzare, date fundamentale și știri.
              </p>
            </div>
          </section>

          {/* Cum sa incepi */}
          <Section id="pornire" title="Cum să începi">
            <Step n={1} title="Caută o acțiune">
              Folosește bara de căutare din stânga pentru a găsi orice acțiune listată pe bursele internaționale.
              Introdu simbolul bursier (ex: <code className="font-mono text-accent">AAPL</code>, <code className="font-mono text-accent">MSFT</code>, <code className="font-mono text-accent">BRD</code>)
              sau numele companiei. Rezultatele apar automat după minimum 1 caracter — fiecare rezultat afișează
              simbolul, numele companiei, bursa și țara de origine.
            </Step>
            <Step n={2} title="Selectează acțiunea">
              Fă clic pe rezultatul dorit din dropdown. Graficul, semnalele, datele fundamentale și știrile
              se încarcă automat pentru acțiunea selectată.
            </Step>
            <Step n={3} title="Alege intervalul de timp">
              Folosește butoanele din bara de sus a graficului pentru a selecta perioada dorită:
              <span className="font-mono text-accent"> 1D · 5D · 1M · 3M · 6M · 1Y · 5Y</span>.
              Perioade mai lungi (1Y, 5Y) oferă mai multe semnale și o perspectivă mai clară a trendului.
            </Step>
            <Step n={4} title="Activează indicatorii doriți">
              Butonele de lângă selectorul de timp îți permit să activezi sau dezactivezi fiecare indicator tehnic.
              Indicatorii activi sunt evidențiați cu albastru.
            </Step>
            <Step n={5} title="Citește semnalele">
              Panoul din dreapta — <em>Semnale de Tranzacționare</em> — afișează toate semnalele detectate,
              de la cel mai recent la cel mai vechi. Semnalele apar și direct pe grafic ca săgeți verde (▲ cumpărare)
              și roșu (▼ vânzare).
            </Step>
          </Section>

          {/* Graficul */}
          <Section id="grafic" title="Graficul">
            <p>
              Graficul principal afișează prețul acțiunii sub formă de lumânări japoneze (<em>candlestick</em>).
              Fiecare lumânare reprezintă o perioadă de timp (1 zi, 1 săptămână sau 1 lună, în funcție de intervalul ales).
            </p>
            <SubSection title="Cum să citești o lumânare">
              <ul className="space-y-1 list-none">
                <li><span className="text-gain font-mono">■ Verde</span> — prețul de închidere este mai mare decât cel de deschidere (sesiune pozitivă)</li>
                <li><span className="text-loss font-mono">■ Roșu</span> — prețul de închidere este mai mic decât cel de deschidere (sesiune negativă)</li>
                <li>Corpul lumânării = intervalul deschidere–închidere</li>
                <li>Fitilele (liniile subțiri) = maximul și minimul sesiunii</li>
              </ul>
            </SubSection>
            <SubSection title="Navigare în grafic">
              <ul className="space-y-1 list-none">
                <li><strong className="text-text-primary">Scroll</strong> — zoom in/out pe axa timpului</li>
                <li><strong className="text-text-primary">Drag</strong> — deplasare stânga/dreapta pe istoric</li>
                <li><strong className="text-text-primary">Crosshair</strong> — mișcă cursorul pe grafic pentru a vedea valorile exacte OHLCV la orice moment</li>
              </ul>
            </SubSection>
            <SubSection title="Sub-panouri">
              <p>
                Indicatorii RSI, MACD, Volum, Stochastic și ATR apar în panouri separate sub graficul principal,
                sincronizate pe axa timpului. Fiecare panou afișează eticheta sa în colțul stânga-sus.
              </p>
            </SubSection>
          </Section>

          {/* Indicatori */}
          <Section id="indicatori" title="Indicatori Tehnici">
            <p>
              Indicatorii tehnici sunt calcule matematice aplicate pe istoricul de prețuri și volume.
              Fiecare poate fi activat sau dezactivat din bara de indicatori de deasupra graficului.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <IndicatorCard
                name="RSI"
                params="Perioadă: 14 zile"
                placement="Sub-panou"
                description="Relative Strength Index — măsoară viteza și amplitudinea mișcărilor de preț. Valori sub 30 indică supravânzare (potențial semnal de cumpărare), valori peste 70 indică supracumpărare (potențial semnal de vânzare). Linii de referință la 30, 50 și 70."
              />
              <IndicatorCard
                name="MACD"
                params="Fast: 12 · Slow: 26 · Signal: 9"
                placement="Sub-panou"
                description="Moving Average Convergence Divergence — arată relația dintre două medii mobile exponențiale. Histograma verde/roșie arată forța trendului. Încrucișarea liniei MACD cu linia Signal generează semnale de cumpărare sau vânzare."
              />
              <IndicatorCard
                name="Bollinger Bands"
                params="Perioadă: 20 · StdDev: 2"
                placement="Overlay"
                description="Trei linii suprapuse pe graficul principal: banda superioară, media mobilă de 20 zile (mijloc) și banda inferioară. Când prețul atinge banda inferioară și RSI < 35, se activează semnalul B4. Benzile se îngustează în perioade de volatilitate scăzută."
              />
              <IndicatorCard
                name="EMA"
                params="Perioade: 9 · 21 · 50 · 200"
                placement="Overlay"
                description="Medii Mobile Exponențiale — reacționează mai rapid la schimbările de preț decât SMA. EMA 9 și 21 sunt utile pentru trenduri pe termen scurt; EMA 50 și 200 pentru trenduri pe termen lung. Prețul peste EMA 200 = trend bullish general."
              />
              <IndicatorCard
                name="SMA"
                params="Perioade: 50 · 200"
                placement="Overlay"
                description="Medii Mobile Simple — calculul clasic al mediei prețurilor de închidere. SMA 200 este folosit ca referință pentru trendul pe termen lung. Încrucișarea SMA 50 peste SMA 200 (Golden Cross) este un semnal bullish clasic."
              />
              <IndicatorCard
                name="Volum"
                params="Medie mobilă: 20 zile"
                placement="Sub-panou"
                description="Numărul de acțiuni tranzacționate. Bare verzi = sesiune pozitivă, bare roșii = sesiune negativă. Linia albastră = media pe 20 de zile. Volume mari confirmă puterea unui trend sau a unei rupturi de nivel."
              />
              <IndicatorCard
                name="Stochastic"
                params="%K: 14 · %D: 3 · Smooth: 3"
                placement="Sub-panou"
                description="Oscilator care compară prețul de închidere cu intervalul high-low din ultimele n perioade. Valori sub 20 = supravânzare, peste 80 = supracumpărare. Linia %K (albastru) și %D (galben) — încrucișarea lor generează semnale."
              />
              <IndicatorCard
                name="ATR"
                params="Perioadă: 14"
                placement="Sub-panou"
                description="Average True Range — măsoară volatilitatea medie a acțiunii. Un ATR în creștere indică volatilitate ridicată. Util pentru setarea stop-loss-ului: un stop la 1-2× ATR sub prețul de intrare este o practică comună."
              />
            </div>
          </Section>

          {/* Semnale */}
          <Section id="semnale" title="Semnale de Tranzacționare">
            <p>
              Semnalele sunt detectate automat pe baza regulilor tehnice definite, aplicând logica de
              <strong className="text-text-primary"> încrucișare strictă</strong>: un semnal se activează doar când
              o valoare trece <em>din zona inferioară în zona superioară</em> a unui prag (nu simpla depășire).
              Semnalele apar pe grafic ca săgeți și în panoul din dreapta.
            </p>
            <div className="rounded-lg border border-border-subtle bg-panel p-4 text-xs font-sans text-text-muted">
              <strong className="text-text-primary">Definiție încrucișare:</strong> valoarea era strict {"<"} prag pe
              lumânarea N-1 și strict {">"} prag pe lumânarea N. Nu se consideră o încrucișare dacă valoarea
              stă la același nivel sau sare direct fără a traversa.
            </div>
          </Section>

          {/* Semnale cumparare */}
          <Section id="semnale-cumparare" title="Semnale de Cumpărare">
            <div className="space-y-3">
              <SignalCard
                rule="B1"
                type="buy"
                label="Cumpărare Puternică — revenire din supravânzare"
                condition="RSI(14) încrucișează în sus pragul 20"
                meaning="Acțiunea a fost în teritoriu de supravânzare extremă (RSI sub 20) și acum revine. Este cel mai puternic semnal de cumpărare — indică o potențială inversare a trendului de scădere. Apare rar și merită atenție sporită."
              />
              <SignalCard
                rule="B2"
                type="buy"
                label="Cumpărare Moderată — confirmare momentum"
                condition="RSI(14) încrucișează în sus pragul 50"
                meaning="RSI trece din zona negativă (sub 50) în cea pozitivă (peste 50), confirmând că momentumul prețului s-a schimbat în favoarea cumpărătorilor. Semnal de confirmare a unui trend ascendent în formare."
              />
              <SignalCard
                rule="B3"
                type="buy"
                label="Cumpărare — încrucișare MACD bullish"
                condition="Linia MACD încrucișează în sus linia Signal ȘI histograma devine pozitivă (MACD > 0)"
                meaning="Dubla confirmare MACD: linia rapidă depășește linia lentă în timp ce întregul MACD este pozitiv. Indică accelerarea momentumului bullish. Histograma pozitivă confirmă că impulsul este susținut."
              />
              <SignalCard
                rule="B4"
                type="buy"
                label="Cumpărare — atingere Bollinger inferior"
                condition="Prețul de închidere ≤ Banda Bollinger inferioară ȘI RSI < 35"
                meaning="Prețul a atins sau depășit banda de devianță standard inferioară în timp ce RSI confirmă supravânzarea. Combinația dintre extensia statistică a prețului și RSI scăzut crește probabilitatea unei reveniri. Semnal bonus — poate apărea mai frecvent în trenduri puternice descendente."
              />
            </div>
          </Section>

          {/* Semnale vanzare */}
          <Section id="semnale-vanzare" title="Semnale de Vânzare">
            <div className="space-y-3">
              <SignalCard
                rule="S1"
                type="sell"
                label="Vânzare Puternică"
                condition="RSI(14) încrucișează în jos pragul 70 ȘI MACD încrucișează în jos pragul 0 (în aceeași lumânare sau în fereastra de 2 lumânări)"
                meaning="Cel mai puternic semnal de vânzare: acțiunea iese din zona de supracumpărare (RSI coboară sub 70) în timp ce MACD confirmă slăbirea momentumului bullish (trece sub zero). Fereastra de 2 lumânări permite captarea situațiilor în care cele două condiții se materializează cu o ușoară decalare."
              />
              <SignalCard
                rule="S2"
                type="warning"
                label="Avertisment Timpuriu de Vânzare"
                condition="Linia MACD încrucișează în jos linia Signal ȘI RSI > 60"
                meaning="Semnal de avertizare — nu o vânzare imediată, ci un semn că momentumul bullish slăbește în timp ce prețul este încă în teritoriu pozitiv. Poate precede o corecție. Util pentru reducerea parțială a poziției sau strângerea stop-loss-ului."
              />
              <SignalCard
                rule="S3"
                type="sell"
                label="Vânzare pe Trend"
                condition="Prețul încrucișează în jos EMA 20 ȘI precedate de 2+ lumânări consecutive descendente"
                meaning="Prețul pierde suportul mediei mobile de 20 de zile după două sesiuni consecutive negative, confirmând că trendul pe termen scurt s-a inversat. Combinația dintre ruptura EMA și presiunea vânzătorilor pe 2 zile consecutive semnalează continuarea scăderii."
              />
            </div>
          </Section>

          {/* Fundamentale */}
          <Section id="fundamentale" title="Date Fundamentale">
            <p>
              Panoul <strong className="text-text-primary">Date Fundamentale</strong> din dreapta afișează
              informații despre compania selectată, actualizate automat la fiecare selecție.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { label: 'Cap. de Piață', desc: 'Valoarea totală a companiei la prețul curent al acțiunii. Indicator al dimensiunii companiei.' },
                { label: 'Raport P/E', desc: 'Price-to-Earnings — câte ori câștigul anual este inclus în prețul acțiunii. P/E ridicat poate indica supraevaluare sau așteptări mari de creștere.' },
                { label: 'EPS', desc: 'Earnings Per Share — profitul net împărțit la numărul de acțiuni. Indicator de profitabilitate per acțiune.' },
                { label: 'Dividend', desc: 'Randamentul dividendului anual față de prețul acțiunii. Relevant pentru investitorii orientați pe venit pasiv.' },
                { label: '52W High / Low', desc: 'Maximul și minimul prețului în ultimele 52 de săptămâni. Util pentru evaluarea poziției curente în contextul anului.' },
                { label: 'Rating Analiști', desc: 'Consensul analiștilor pe o scară de la 1 (Cumpărare Puternică) la 5 (Vânzare Puternică). Bazat pe recomandările institutionale.' },
              ].map(({ label, desc }) => (
                <div key={label} className="rounded-lg border border-border-subtle bg-panel p-3">
                  <p className="font-mono text-xs text-accent font-semibold mb-1">{label}</p>
                  <p className="text-xs text-text-muted font-sans leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Watchlist */}
          <Section id="watchlist" title="Lista de Urmărire (Watchlist)">
            <p>
              Poți salva acțiunile de interes în lista de urmărire pentru acces rapid. Lista este salvată
              local în browser (localStorage) și rămâne disponibilă la revenirea în aplicație.
            </p>
            <ul className="space-y-2 mt-2">
              <li><strong className="text-text-primary">Adăugare:</strong> după selectarea unei acțiuni, apasă butonul <em>Adaugă la Liste</em> din bara laterală sau butonul <em>Urmărește</em> din bara de deasupra graficului.</li>
              <li><strong className="text-text-primary">Selectare rapidă:</strong> fă clic pe orice rând din watchlist pentru a încărca imediat acțiunea respectivă.</li>
              <li><strong className="text-text-primary">Prețuri live:</strong> fiecare acțiune din watchlist afișează prețul curent și variația zilnică, actualizate la 30 de secunde în orele de tranzacționare.</li>
              <li><strong className="text-text-primary">Eliminare:</strong> apasă butonul ✕ de lângă simbol pentru a scoate acțiunea din listă.</li>
            </ul>
          </Section>

          {/* Stiri */}
          <Section id="stiri" title="Știri">
            <p>
              Panoul <strong className="text-text-primary">Știri</strong> afișează cele mai recente articole
              legate de acțiunea selectată, preluate din Yahoo Finance. Fiecare articol include:
            </p>
            <ul className="mt-2 space-y-1">
              <li><strong className="text-text-primary">Titlu și sursă</strong> — fă clic pe articol pentru a-l deschide în tab nou</li>
              <li><strong className="text-text-primary">Data publicării</strong> — afișată în format scurt</li>
              <li>
                <strong className="text-text-primary">Sentiment</strong> — clasificare automată a tonului articolului:
                <span className="ml-1 text-gain font-mono text-xs font-semibold">POZITIV</span>
                <span className="mx-1 text-text-dim">·</span>
                <span className="text-loss font-mono text-xs font-semibold">NEGATIV</span>
                <span className="mx-1 text-text-dim">·</span>
                <span className="text-text-muted font-mono text-xs font-semibold">NEUTRU</span>
              </li>
            </ul>
            <p className="text-xs text-text-dim mt-2">
              Clasificarea sentimentului este automată, bazată pe cuvinte cheie din titlu, și poate să nu reflecte întotdeauna nuanțele articolului.
            </p>
          </Section>

          {/* Sfaturi */}
          <Section id="sfaturi" title="Sfaturi practice">
            <div className="space-y-3">
              <div className="rounded-lg border border-border-subtle bg-panel p-4">
                <p className="font-sans font-semibold text-text-primary text-sm mb-1">Folosește perioade mai lungi pentru semnale mai fiabile</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Pe intervale de 1M sau 3M cu date zilnice, semnalele sunt mai frecvente dar pot fi mai zgomotoase.
                  Pe 1Y sau 5Y cu date săptămânale sau lunare, semnalele sunt mai rare dar au semnificație mai mare.
                </p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-panel p-4">
                <p className="font-sans font-semibold text-text-primary text-sm mb-1">Combină mai mulți indicatori</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Un semnal B3 (MACD) apărut în același timp cu RSI în teritoriu pozitiv și prețul peste EMA 50
                  are o probabilitate mai mare de succes decât un semnal izolat. Nu lua decizii bazate pe un singur indicator.
                </p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-panel p-4">
                <p className="font-sans font-semibold text-text-primary text-sm mb-1">ATR pentru dimensionarea riscului</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Dacă ATR-ul unei acțiuni este de 5 USD, un stop-loss la 1-2× ATR (5–10 USD sub prețul de intrare)
                  este un nivel rezonabil care lasă spațiu pentru volatilitatea normală.
                </p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-panel p-4">
                <p className="font-sans font-semibold text-text-primary text-sm mb-1">Datele au întârziere de 15 minute</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Datele de piață afișate au o întârziere de aproximativ 15 minute față de prețul real.
                  Polling-ul live (în orele de tranzacționare 9:30–16:00 ET) actualizează cotațiile la fiecare 30 de secunde,
                  dar nu înlocuiește un feed în timp real.
                </p>
              </div>
            </div>
          </Section>

          {/* Disclaimer */}
          <section id="disclaimer">
            <div className="rounded-xl border border-loss/30 bg-loss/5 p-5">
              <h2 className="text-sm font-sans font-bold text-loss uppercase tracking-wide mb-2">
                ⚠ Disclaimer important
              </h2>
              <p className="text-sm font-sans text-text-muted leading-relaxed">
                <strong className="text-text-primary">StockScope este exclusiv în scop informativ.</strong>{' '}
                Semnalele generate automat nu constituie consiliere financiară, recomandare de investiție sau
                îndemnuri de cumpărare/vânzare. Performanțele trecute nu garantează rezultate viitoare.
                Investițiile pe piețele financiare implică riscuri semnificative, inclusiv pierderea capitalului investit.
                Consultați un consilier financiar autorizat înainte de a lua orice decizie de investiție.
              </p>
            </div>
          </section>

        </main>
      </div>

      <footer className="border-t border-border-subtle bg-panel mt-10">
        <div className="max-w-5xl mx-auto px-6 py-4 text-center">
          <p className="text-xs font-sans text-text-dim">
            Doar în scop informativ. Nu constituie consiliere financiară. Datele de piață au o întârziere de 15 minute.
          </p>
        </div>
      </footer>
    </div>
  );
}
