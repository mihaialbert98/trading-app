'use client';
import { useState } from 'react';

interface CompanyLogoProps {
  symbol: string;
  name: string;
  size?: number;
}

// Well-known domain map for top tickers — Clearbit needs a domain, not a ticker
const DOMAIN_MAP: Record<string, string> = {
  AAPL: 'apple.com', MSFT: 'microsoft.com', GOOGL: 'google.com', GOOG: 'google.com',
  AMZN: 'amazon.com', META: 'meta.com', TSLA: 'tesla.com', NVDA: 'nvidia.com',
  NFLX: 'netflix.com', ORCL: 'oracle.com', ADBE: 'adobe.com', CRM: 'salesforce.com',
  INTC: 'intel.com', AMD: 'amd.com', QCOM: 'qualcomm.com', TXN: 'ti.com',
  CSCO: 'cisco.com', IBM: 'ibm.com', PYPL: 'paypal.com', SQ: 'squareup.com',
  SHOP: 'shopify.com', UBER: 'uber.com', LYFT: 'lyft.com', SNAP: 'snap.com',
  TWTR: 'twitter.com', SPOT: 'spotify.com', PINS: 'pinterest.com', RBLX: 'roblox.com',
  COIN: 'coinbase.com', HOOD: 'robinhood.com', ABNB: 'airbnb.com', DASH: 'doordash.com',
  PLTR: 'palantir.com', SNOW: 'snowflake.com', DDOG: 'datadoghq.com', NET: 'cloudflare.com',
  ZM: 'zoom.us', WORK: 'slack.com', OKTA: 'okta.com', CRWD: 'crowdstrike.com',
  PANW: 'paloaltonetworks.com', FTNT: 'fortinet.com', ZS: 'zscaler.com',
  JPM: 'jpmorganchase.com', BAC: 'bankofamerica.com', WFC: 'wellsfargo.com',
  GS: 'goldmansachs.com', MS: 'morganstanley.com', C: 'citi.com', AXP: 'americanexpress.com',
  V: 'visa.com', MA: 'mastercard.com', BRK: 'berkshirehathaway.com',
  JNJ: 'jnj.com', PFE: 'pfizer.com', MRK: 'merck.com', ABBV: 'abbvie.com',
  LLY: 'lilly.com', BMY: 'bms.com', AMGN: 'amgen.com', GILD: 'gilead.com',
  UNH: 'unitedhealthgroup.com', CVS: 'cvs.com', HUM: 'humana.com',
  WMT: 'walmart.com', TGT: 'target.com', COST: 'costco.com', HD: 'homedepot.com',
  LOW: 'lowes.com', MCD: 'mcdonalds.com', SBUX: 'starbucks.com',
  NKE: 'nike.com', DIS: 'disney.com', CMCSA: 'comcast.com',
  T: 'att.com', VZ: 'verizon.com', TMUS: 'tmobile.com',
  XOM: 'exxonmobil.com', CVX: 'chevron.com', COP: 'conocophillips.com',
  BA: 'boeing.com', LMT: 'lockheedmartin.com', RTX: 'rtx.com', GE: 'ge.com',
  CAT: 'caterpillar.com', DE: 'deere.com', MMM: '3m.com',
  TSMC: 'tsmc.com', TSM: 'tsmc.com', ASML: 'asml.com', SAP: 'sap.com',
};

function getLogoUrl(symbol: string): string | null {
  const domain = DOMAIN_MAP[symbol.toUpperCase()];
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}

export default function CompanyLogo({ symbol, name, size = 28 }: CompanyLogoProps) {
  const [error, setError] = useState(false);
  const logoUrl = getLogoUrl(symbol);

  if (!logoUrl || error) {
    // Fallback: colored circle with first two letters
    const initials = symbol.slice(0, 2).toUpperCase();
    const hue = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `hsl(${hue}, 60%, 35%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.35,
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 700,
          color: 'white',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={name}
      width={size}
      height={size}
      style={{
        borderRadius: '50%',
        objectFit: 'contain',
        background: 'white',
        flexShrink: 0,
        padding: 2,
      }}
      onError={() => setError(true)}
    />
  );
}
