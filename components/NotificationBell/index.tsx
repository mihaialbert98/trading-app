'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@/store';

export default function NotificationBell() {
  const notifications = useStore((s) => s.notifications);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);
  const clearNotifications = useStore((s) => s.clearNotifications);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const unread = notifications.filter((n) => !n.read).length;

  // Position the portal panel below the button
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelStyle({ top: rect.bottom + 4, left: rect.left });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function toggle() {
    if (!open) markAllNotificationsRead();
    setOpen((v) => !v);
  }

  const panel = open ? (
    <div
      ref={panelRef}
      style={{ position: 'fixed', top: panelStyle.top, left: panelStyle.left, zIndex: 9999 }}
      className="w-80 rounded-lg border border-border-subtle bg-panel shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
        <span className="text-xs font-mono font-semibold text-text-primary">Notifications</span>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-[10px] font-sans text-text-dim hover:text-text-muted transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-text-dim text-xs font-sans">
            No notifications yet.
            <br />
            Signals on watchlist stocks appear here.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`px-3 py-2.5 border-b border-border-subtle last:border-0 ${
                n.read ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-accent shrink-0">
                  {n.symbol}
                </span>
                <span className="text-[10px] font-mono text-text-dim shrink-0">
                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] font-sans text-text-muted mt-0.5 leading-snug">
                {n.title.replace(` — ${n.symbol}`, '')}
              </p>
              <p className="text-[10px] font-sans text-text-dim mt-0.5 leading-snug">
                {n.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggle}
        className="relative p-2 rounded text-text-muted hover:text-text-primary transition-colors"
        aria-label="Notifications"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3.5L2 11h12l-1.5-1.5V6A4.5 4.5 0 0 0 8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 12.5a1.5 1.5 0 0 0 3 0"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-loss text-white text-[9px] font-mono font-bold flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {typeof document !== 'undefined' && panel && createPortal(panel, document.body)}
    </div>
  );
}
