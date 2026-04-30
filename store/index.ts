import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IndicatorType } from '@/types/indicators';

export type { IndicatorType };

export type Timeframe = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y';
export type Interval = '1d' | '1wk' | '1mo';

export interface WatchlistItem {
  symbol: string;
  name: string;
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
  theme: 'dark' | 'light';
  // actions
  setSelectedSymbol: (symbol: string, name: string) => void;
  addToWatchlist: (symbol: string, name: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  toggleIndicator: (indicator: IndicatorType) => void;
  setTimeframe: (tf: Timeframe, interval: Interval) => void;
  toggleTheme: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      selectedSymbol: null,
      selectedName: null,
      watchlist: [],
      activeIndicators: ['RSI', 'MACD', 'VOLUME'],
      emaPeriods: [9, 21, 50, 200],
      smaPeriods: [50, 200],
      timeframe: '3mo',
      interval: '1d',
      theme: 'dark',

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

      setTimeframe: (tf: Timeframe, interval: Interval) =>
        set({ timeframe: tf, interval }),

      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'stockscope-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        watchlist: state.watchlist,
        theme: state.theme,
        activeIndicators: state.activeIndicators,
        emaPeriods: state.emaPeriods,
        smaPeriods: state.smaPeriods,
        timeframe: state.timeframe,
        interval: state.interval,
      }),
    }
  )
);
