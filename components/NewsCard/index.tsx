import type { NewsItem } from '@/types/stock';

const SENTIMENT_CONFIG = {
  POSITIVE: {
    label: 'POZITIV',
    bg: 'bg-gain/10',
    text: 'text-gain',
    border: 'border-gain/30',
  },
  NEGATIVE: {
    label: 'NEGATIV',
    bg: 'bg-loss/10',
    text: 'text-loss',
    border: 'border-loss/30',
  },
  NEUTRAL: {
    label: 'NEUTRU',
    bg: 'bg-border-subtle',
    text: 'text-text-muted',
    border: 'border-border-subtle',
  },
};

function formatNewsDate(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(ts));
}

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const sentiment = SENTIMENT_CONFIG[item.sentiment];

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex gap-3 p-3 rounded-lg
        border border-border-subtle
        bg-panel hover:bg-panel-hover
        transition-colors group
      "
    >
      {item.thumbnail && (
        <div className="shrink-0 w-16 h-16 rounded overflow-hidden bg-border-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-sans font-medium text-text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {item.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className="text-xs font-sans text-text-muted">{item.source}</span>
          <span className="text-text-dim">·</span>
          <span className="text-xs font-mono text-text-dim">{formatNewsDate(item.publishedAt)}</span>
          <span
            className={`
              ml-auto text-[10px] font-mono font-semibold px-1.5 py-0.5
              rounded border tracking-wide
              ${sentiment.bg} ${sentiment.text} ${sentiment.border}
            `}
          >
            {sentiment.label}
          </span>
        </div>
      </div>
    </a>
  );
}
