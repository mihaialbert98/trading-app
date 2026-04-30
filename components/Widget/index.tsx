'use client';

import { type ReactNode } from 'react';
import { useStore } from '@/store';
import type { WidgetId } from '@/store';

interface WidgetProps {
  id: WidgetId;
  title: string;
  badge?: ReactNode;
  titleRight?: ReactNode;
  children: ReactNode;
  tourAttr?: string;
}

export default function Widget({
  id,
  title,
  badge,
  titleRight,
  children,
  tourAttr,
}: WidgetProps) {
  const widget = useStore((s) => s.widgets.find((w) => w.id === id));
  const toggleCollapsed = useStore((s) => s.toggleWidgetCollapsed);

  if (!widget?.visible) return null;

  return (
    <div
      className="bg-panel border border-border-subtle rounded-lg flex flex-col shrink-0"
      style={widget.collapsed ? undefined : { minHeight: '400px' }}
      {...(tourAttr ? { 'data-tour': tourAttr } : {})}
    >
      {/* Header */}
      <button
        onClick={() => toggleCollapsed(id)}
        className="w-full flex items-center gap-2 px-4 py-3 border-b border-border-subtle hover:bg-panel-hover transition-colors"
      >
        {/* Title + badge — allowed to grow but must leave room for chevron */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          <h2 className="text-sm font-sans font-semibold text-text-primary tracking-wide uppercase truncate shrink">
            {title}
          </h2>
          {badge && <span className="shrink-0 text-xs font-mono text-text-muted">{badge}</span>}
        </div>
        {/* Right actions — always visible, never pushed off */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {!widget.collapsed && titleRight}
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            aria-hidden
            className={`text-text-dim transition-transform duration-200 shrink-0 ${widget.collapsed ? '' : 'rotate-180'}`}
          >
            <path
              d="M2 3.5l3.5 3.5 3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Content — grows to fill the widget's min-height */}
      {!widget.collapsed && (
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}
