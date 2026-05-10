import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IndicatorType } from '@/types/indicators';
import type { CustomRule } from '@/types/customSignals';

export type { IndicatorType };

export type Timeframe = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y';
export type Interval = '1h' | '4h' | '1d' | '1wk' | '1mo';

export interface WatchlistItem {
  symbol: string;
  name: string;
}

export interface AppNotification {
  id: string;
  symbol: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export type WidgetId = 'signals' | 'custom-signals' | 'fundamentals' | 'news';

export interface WidgetConfig {
  id: WidgetId;
  visible: boolean;
  collapsed: boolean;
}

interface StoreState {
  selectedSymbol: string | null;
  selectedName: string | null;
  watchlist: WatchlistItem[];
  activeIndicators: IndicatorType[];
  emaPeriods: number[];
  smaPeriods: number[];
  timeframe: Timeframe;
  interval: Interval;
  viewDays: number | null;
  theme: 'dark' | 'light';
  locale: 'ro' | 'en';
  customRules: CustomRule[];
  widgets: WidgetConfig[];
  notifications: AppNotification[];
  // actions
  setSelectedSymbol: (symbol: string, name: string) => void;
  addCustomRule: (rule: CustomRule) => void;
  updateCustomRule: (rule: CustomRule) => void;
  removeCustomRule: (id: string) => void;
  toggleCustomRule: (id: string) => void;
  addToWatchlist: (symbol: string, name: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  toggleIndicator: (indicator: IndicatorType) => void;
  selectedSignalTimestamp: number | null;
  setSelectedSignalTimestamp: (ts: number | null) => void;
  setTimeframe: (tf: Timeframe, interval: Interval, viewDays?: number | null) => void;
  toggleTheme: () => void;
  setLocale: (locale: 'ro' | 'en') => void;
  toggleWidgetVisible: (id: WidgetId) => void;
  toggleWidgetCollapsed: (id: WidgetId) => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      selectedSymbol: null,
      selectedName: null,
      selectedSignalTimestamp: null,
      watchlist: [],
      activeIndicators: ['RSI', 'MACD', 'VOLUME'],
      emaPeriods: [9, 21, 50, 200],
      smaPeriods: [50, 200],
      timeframe: '3mo',
      interval: '1d',
      viewDays: null,
      theme: 'dark',
      locale: 'ro',
      customRules: [],
      notifications: [],
      widgets: [
        { id: 'signals', visible: true, collapsed: false },
        { id: 'custom-signals', visible: true, collapsed: false },
        { id: 'fundamentals', visible: true, collapsed: false },
        { id: 'news', visible: true, collapsed: false },
      ],

      setSelectedSymbol: (symbol: string, name: string) =>
        set({ selectedSymbol: symbol, selectedName: name }),

      addToWatchlist: (symbol: string, name: string) => {
        const { watchlist } = get();
        if (!watchlist.find((w) => w.symbol === symbol)) {
          set({ watchlist: [...watchlist, { symbol, name }] });
        }
      },

      removeFromWatchlist: (symbol: string) => {
        set({ watchlist: get().watchlist.filter((w) => w.symbol !== symbol) });
      },

      toggleIndicator: (indicator: IndicatorType) => {
        const { activeIndicators } = get();
        if (activeIndicators.includes(indicator)) {
          set({ activeIndicators: activeIndicators.filter((i) => i !== indicator) });
        } else {
          set({ activeIndicators: [...activeIndicators, indicator] });
        }
      },

      setSelectedSignalTimestamp: (ts: number | null) =>
        set({ selectedSignalTimestamp: ts }),

      setTimeframe: (tf: Timeframe, interval: Interval, viewDays?: number | null) =>
        set({ timeframe: tf, interval, viewDays: viewDays ?? null }),

      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      setLocale: (locale: 'ro' | 'en') => set({ locale }),

      toggleWidgetVisible: (id: WidgetId) =>
        set({
          widgets: get().widgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w,
          ),
        }),

      toggleWidgetCollapsed: (id: WidgetId) =>
        set({
          widgets: get().widgets.map((w) =>
            w.id === id ? { ...w, collapsed: !w.collapsed } : w,
          ),
        }),

      addNotification: (n) =>
        set({
          notifications: [
            { ...n, id: `${n.symbol}:${Date.now()}`, read: false, timestamp: Date.now() },
            ...get().notifications,
          ].slice(0, 50), // keep max 50
        }),

      markAllNotificationsRead: () =>
        set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),

      clearNotifications: () => set({ notifications: [] }),

      addCustomRule: (rule: CustomRule) =>
        set({ customRules: [...get().customRules, rule] }),

      updateCustomRule: (rule: CustomRule) =>
        set({ customRules: get().customRules.map((r) => (r.id === rule.id ? rule : r)) }),

      removeCustomRule: (id: string) =>
        set({ customRules: get().customRules.filter((r) => r.id !== id) }),

      toggleCustomRule: (id: string) =>
        set({
          customRules: get().customRules.map((r) =>
            r.id === id ? { ...r, enabled: !r.enabled } : r,
          ),
        }),
    }),
    {
      name: 'stockscope-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        watchlist: state.watchlist,
        theme: state.theme,
        locale: state.locale,
        activeIndicators: state.activeIndicators,
        emaPeriods: state.emaPeriods,
        smaPeriods: state.smaPeriods,
        timeframe: state.timeframe,
        interval: state.interval,
        viewDays: state.viewDays,
        customRules: state.customRules,
        widgets: state.widgets,
      }),
    }
  )
);
