/**
 * Format a price value using Intl.NumberFormat.
 * Defaults to USD with 2 decimal places.
 */
export function formatPrice(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a market cap value with T/B/M suffix.
 * e.g. "$1.23T", "$456.7B", "$12.3M"
 */
export function formatMarketCap(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  }
  return `${sign}$${new Intl.NumberFormat('en-US').format(abs)}`;
}

/**
 * Format a percentage value with sign prefix.
 * e.g. "+2.34%", "-1.50%"
 */
export function formatPercent(value: number, decimals = 2): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(value));
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatted}%`;
}

/**
 * Format a volume value with K/M/B suffix.
 * e.g. "12.3M", "456.7K", "1.23B"
 */
export function formatVolume(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `${(abs / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${(abs / 1_000).toFixed(1)}K`;
  }
  return String(abs);
}

/**
 * Format a Unix millisecond timestamp as a locale date string.
 * e.g. "Apr 30, 2026"
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}
