'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type SeriesMarker,
  type Time,
  ColorType,
  CrosshairMode,
} from 'lightweight-charts';
import type { OHLCV } from '@/types/stock';
import type { SignalEvent } from '@/types/signals';
import type {
  RSIResult,
  MACDResult,
  BollingerResult,
  EMAResult,
  SMAResult,
  StochasticResult,
  ATRResult,
  VolumeResult,
  IndicatorType,
} from '@/types/indicators';

const CHART_BG = '#0f172a';
const GRID_COLOR = '#1e293b';
const BORDER_COLOR = '#334155';
const TEXT_COLOR = '#94a3b8';
const CROSSHAIR_COLOR = '#475569';
const CANDLE_UP = '#22C55E';
const CANDLE_DOWN = '#EF4444';
const VOLUME_UP = '#22C55E33';
const VOLUME_DOWN = '#EF454433';
const RSI_COLOR = '#0EA5E9';
const MACD_LINE_COLOR = '#0EA5E9';
const MACD_SIGNAL_COLOR = '#F59E0B';
const MACD_HIST_UP = '#22C55E';
const MACD_HIST_DOWN = '#EF4444';
const BOLL_UPPER = '#64748b';
const BOLL_MIDDLE = '#94a3b8';
const BOLL_LOWER = '#64748b';
const EMA_COLORS = ['#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'] as const;
const SMA_COLORS = ['#F97316', '#14B8A6'] as const;
const STOCH_K = '#0EA5E9';
const STOCH_D = '#F59E0B';
const ATR_COLOR = '#A78BFA';

// How many logical bars from the left edge trigger a historical fetch
const SCROLL_BACK_THRESHOLD = 10;

interface IndicatorsData {
  rsi?: RSIResult;
  macd?: MACDResult;
  bollinger?: BollingerResult;
  ema?: EMAResult[];
  sma?: SMAResult[];
  stochastic?: StochasticResult;
  atr?: ATRResult;
  volume?: VolumeResult;
}

interface ChartCoreProps {
  ohlcv: OHLCV[];          // full merged array (fresh + prepended) — all series data
  viewportOhlcv: OHLCV[];  // fresh range only — pins the initial visible window
  signals: SignalEvent[];
  indicators: IndicatorsData;
  activeIndicators: IndicatorType[];
  selectedSignalTimestamp: number | null;
  onScrollBackRequest?: (oldestTimestamp: number) => void;
  isLoadingMore?: boolean;
}

function toTime(ts: number): Time {
  return Math.floor(ts / 1000) as Time;
}

function toLineData(ohlcv: OHLCV[], values: (number | null)[]) {
  // values array may be shorter than ohlcv when prepended history exists.
  // Align from the end: values[values.length-1] corresponds to ohlcv[ohlcv.length-1].
  const offset = ohlcv.length - values.length;
  return ohlcv
    .map((d, i) => ({ time: toTime(d.timestamp), value: values[i - offset] }))
    .filter((d): d is { time: Time; value: number } => d.value !== null && d.value !== undefined);
}

// Compute responsive sub-panel height based on container height
function getSubH(containerH: number, subCount: number): number {
  if (subCount === 0) return 0;
  // On small screens give less space to sub-panels
  if (containerH < 400) return 70;
  if (containerH < 600) return 85;
  return 100;
}

export default function ChartCore({
  ohlcv,
  viewportOhlcv,
  signals,
  indicators,
  activeIndicators,
  selectedSignalTimestamp,
  onScrollBackRequest,
  isLoadingMore = false,
}: ChartCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const mainChartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const signalMarkersRef = useRef<SeriesMarker<Time>[]>([]);

  // Track which panels are rendered to avoid full rebuild on indicator toggle
  const activeIndicatorsRef = useRef<IndicatorType[]>(activeIndicators);
  // Series refs for live-update without rebuild
  const seriesMapRef = useRef<Map<string, ISeriesApi<'Line' | 'Histogram' | 'Candlestick'>>>(new Map());
  const allChartsRef = useRef<IChartApi[]>([]);
  const subChartsRef = useRef<IChartApi[]>([]);

  // Whether we've triggered a scroll-back fetch already (prevents duplicate calls)
  const scrollBackFetchingRef = useRef(false);
  // Suppresses scroll-back detection during initial viewport setup
  const viewportReadyRef = useRef(false);

  // Refs so effects always read latest values without adding them to deps
  const indicatorsRef = useRef<IndicatorsData>(indicators);
  const viewportOhlcvRef = useRef<OHLCV[]>(viewportOhlcv);
  const onScrollBackRequestRef = useRef(onScrollBackRequest);
  // Update synchronously on every render so closures always see current values
  indicatorsRef.current = indicators;
  viewportOhlcvRef.current = viewportOhlcv;
  onScrollBackRequestRef.current = onScrollBackRequest;

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 1 — build chart structure.
  // Depends only on [ohlcv, signals, activeIndicators].
  // Creates all series, seeds them with whatever indicatorsRef.current holds
  // at that moment (may be empty or fully populated — doesn't matter because
  // Phase 2 always overwrites with the latest data).
  // ─────────────────────────────────────────────────────────────────────────
  const buildCharts = useCallback(() => {
    if (!containerRef.current || ohlcv.length === 0) return;

    // Read latest values from refs — not deps so they don't trigger rebuilds
    const currentIndicators = indicatorsRef.current;
    const viewportOhlcv = viewportOhlcvRef.current;

    // Cleanup previous
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    containerRef.current.innerHTML = '';
    seriesMapRef.current.clear();
    allChartsRef.current = [];
    subChartsRef.current = [];
    scrollBackFetchingRef.current = false;
    viewportReadyRef.current = false;

    const container = containerRef.current;
    const totalWidth = container.clientWidth;

    const subPanels: IndicatorType[] = (['RSI', 'MACD', 'VOLUME', 'STOCHASTIC', 'ATR'] as IndicatorType[]).filter(
      (p) => activeIndicators.includes(p)
    );
    activeIndicatorsRef.current = activeIndicators;

    const totalHeight = container.clientHeight;
    const SUB_H = getSubH(totalHeight, subPanels.length);
    const mainHeight = Math.max(200, totalHeight - subPanels.length * SUB_H);

    const baseChartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: CHART_BG },
        textColor: TEXT_COLOR,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: GRID_COLOR },
        horzLines: { color: GRID_COLOR },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: CROSSHAIR_COLOR, width: 1 as const, style: LineStyle.LargeDashed },
        horzLine: { color: CROSSHAIR_COLOR, width: 1 as const, style: LineStyle.LargeDashed },
      },
      rightPriceScale: {
        borderColor: BORDER_COLOR,
        textColor: TEXT_COLOR,
      },
      timeScale: {
        borderColor: BORDER_COLOR,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    };

    // ── Main chart ──
    const mainWrapper = document.createElement('div');
    mainWrapper.style.cssText = `width:100%;height:${mainHeight}px;`;
    container.appendChild(mainWrapper);

    const mainChart = createChart(mainWrapper, {
      ...baseChartOptions,
      width: totalWidth,
      height: mainHeight,
    });
    allChartsRef.current.push(mainChart);
    mainChartRef.current = mainChart;
    candleSeriesRef.current = null;
    signalMarkersRef.current = [];

    // Candlestick
    const candleSeries = mainChart.addSeries(CandlestickSeries, {
      upColor: CANDLE_UP,
      downColor: CANDLE_DOWN,
      borderUpColor: CANDLE_UP,
      borderDownColor: CANDLE_DOWN,
      wickUpColor: CANDLE_UP,
      wickDownColor: CANDLE_DOWN,
    });

    const candleData = ohlcv.map((d) => ({
      time: toTime(d.timestamp),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candleSeries.setData(candleData);
    candleSeriesRef.current = candleSeries;
    seriesMapRef.current.set('candle', candleSeries);

    // Bollinger Bands overlay
    if (activeIndicators.includes('BOLLINGER')) {
      const lineOpts = { lineWidth: 1 as const, priceLineVisible: false, lastValueVisible: false };
      const upperSeries = mainChart.addSeries(LineSeries, { ...lineOpts, color: BOLL_UPPER, lineStyle: LineStyle.Dashed });
      const middleSeries = mainChart.addSeries(LineSeries, { ...lineOpts, color: BOLL_MIDDLE, lineStyle: LineStyle.Dotted });
      const lowerSeries = mainChart.addSeries(LineSeries, { ...lineOpts, color: BOLL_LOWER, lineStyle: LineStyle.Dashed });
      if (currentIndicators.bollinger) {
        upperSeries.setData(toLineData(ohlcv, currentIndicators.bollinger.upper));
        middleSeries.setData(toLineData(ohlcv, currentIndicators.bollinger.middle));
        lowerSeries.setData(toLineData(ohlcv, currentIndicators.bollinger.lower));
      }
      seriesMapRef.current.set('boll_upper', upperSeries);
      seriesMapRef.current.set('boll_middle', middleSeries);
      seriesMapRef.current.set('boll_lower', lowerSeries);
    }

    // EMA overlays
    if (activeIndicators.includes('EMA')) {
      const emaResults = currentIndicators.ema ?? [];
      emaResults.forEach((emaResult, idx) => {
        const color = EMA_COLORS[idx % EMA_COLORS.length];
        const s = mainChart.addSeries(LineSeries, {
          color,
          lineWidth: 1 as const,
          priceLineVisible: false,
          lastValueVisible: true,
          title: `EMA${emaResult.period}`,
        });
        s.setData(toLineData(ohlcv, emaResult.values));
        seriesMapRef.current.set(`ema_${emaResult.period}`, s);
      });
    }

    // SMA overlays
    if (activeIndicators.includes('SMA')) {
      const smaResults = currentIndicators.sma ?? [];
      smaResults.forEach((smaResult, idx) => {
        const color = SMA_COLORS[idx % SMA_COLORS.length];
        const s = mainChart.addSeries(LineSeries, {
          color,
          lineWidth: 1 as const,
          lineStyle: LineStyle.Dotted,
          priceLineVisible: false,
          lastValueVisible: true,
          title: `SMA${smaResult.period}`,
        });
        s.setData(toLineData(ohlcv, smaResult.values));
        seriesMapRef.current.set(`sma_${smaResult.period}`, s);
      });
    }

    // Signal markers — snap signal timestamp to nearest candle time
    if (signals.length > 0) {
      const candleTimes = candleData.map((c) => c.time as number);
      const markers: SeriesMarker<Time>[] = signals
        .map((sig): SeriesMarker<Time> | null => {
          const t = toTime(sig.timestamp);
          const closest = candleTimes.reduce((best, ct) =>
            Math.abs(ct - (t as number)) < Math.abs(best - (t as number)) ? ct : best
          );
          if (Math.abs(closest - (t as number)) > 5 * 24 * 3600) return null;
          const isBuy = sig.type === 'STRONG_BUY' || sig.type === 'BUY';
          return {
            time: closest as Time,
            position: isBuy ? ('belowBar' as const) : ('aboveBar' as const),
            color: isBuy ? CANDLE_UP : CANDLE_DOWN,
            shape: isBuy ? ('arrowUp' as const) : ('arrowDown' as const),
            text: sig.rule,
            size: sig.type === 'STRONG_BUY' || sig.type === 'STRONG_SELL' ? 2 : 1,
          };
        })
        .filter((m): m is SeriesMarker<Time> => m !== null)
        .sort((a, b) => (a.time as number) - (b.time as number));

      if (markers.length > 0) {
        createSeriesMarkers(candleSeries, markers);
        signalMarkersRef.current = markers;
      }
    }

    // ── Sub-panel factory ──
    function createSubPanel(title: string) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position:relative;width:100%;height:${SUB_H}px;
        border-top:1px solid ${BORDER_COLOR};
      `;
      container.appendChild(wrapper);

      const label = document.createElement('div');
      label.style.cssText = `
        position:absolute;top:4px;left:8px;
        font-size:10px;font-family:"IBM Plex Mono",monospace;
        color:${TEXT_COLOR};z-index:10;pointer-events:none;
      `;
      label.textContent = title;
      wrapper.appendChild(label);

      const chart = createChart(wrapper, {
        ...baseChartOptions,
        width: totalWidth,
        height: SUB_H,
        timeScale: { ...baseChartOptions.timeScale, visible: false },
        rightPriceScale: {
          ...baseChartOptions.rightPriceScale,
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
      });
      subChartsRef.current.push(chart);
      allChartsRef.current.push(chart);

      function addRefLine(value: number, color: string) {
        const s = chart.addSeries(LineSeries, {
          color,
          lineWidth: 1 as const,
          lineStyle: LineStyle.Dashed,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        s.setData(ohlcv.map((d) => ({ time: toTime(d.timestamp), value })));
      }

      return { chart, addRefLine };
    }

    // RSI — always create series when RSI is active so Phase 2 can populate it
    if (activeIndicators.includes('RSI')) {
      const { chart, addRefLine } = createSubPanel('RSI(14)');
      addRefLine(70, '#EF444466');
      addRefLine(50, '#64748b66');
      addRefLine(30, '#22C55E66');
      const s = chart.addSeries(LineSeries, {
        color: RSI_COLOR,
        lineWidth: 2 as const,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      if (currentIndicators.rsi) {
        s.setData(toLineData(ohlcv, currentIndicators.rsi.values));
      }
      seriesMapRef.current.set('rsi', s);
    }

    // MACD — always create series when MACD is active so Phase 2 can populate it
    if (activeIndicators.includes('MACD')) {
      const { chart, addRefLine } = createSubPanel('MACD(12,26,9)');
      addRefLine(0, '#64748b88');

      const histSeries = chart.addSeries(HistogramSeries, {
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const macdLine = chart.addSeries(LineSeries, {
        color: MACD_LINE_COLOR,
        lineWidth: 2 as const,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const signalLine = chart.addSeries(LineSeries, {
        color: MACD_SIGNAL_COLOR,
        lineWidth: 1 as const,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      if (currentIndicators.macd) {
        const histData = ohlcv
          .map((d, i) => {
            const v = currentIndicators.macd!.histogram[i];
            if (v === null || v === undefined) return null;
            return { time: toTime(d.timestamp), value: v, color: v >= 0 ? MACD_HIST_UP : MACD_HIST_DOWN };
          })
          .filter((d): d is { time: Time; value: number; color: string } => d !== null);
        histSeries.setData(histData);
        macdLine.setData(toLineData(ohlcv, currentIndicators.macd.macd));
        signalLine.setData(toLineData(ohlcv, currentIndicators.macd.signal));
      }

      seriesMapRef.current.set('macd_hist', histSeries);
      seriesMapRef.current.set('macd_line', macdLine);
      seriesMapRef.current.set('macd_signal', signalLine);
    }

    // Volume — always create series when VOLUME is active so Phase 2 can populate it
    if (activeIndicators.includes('VOLUME')) {
      const { chart } = createSubPanel('Volume');
      const volSeries = chart.addSeries(HistogramSeries, {
        priceLineVisible: false,
        lastValueVisible: false,
      });

      if (currentIndicators.volume) {
        volSeries.setData(
          ohlcv.map((d, i) => ({
            time: toTime(d.timestamp),
            value: currentIndicators.volume!.volumes[i],
            color: d.close >= d.open ? VOLUME_UP : VOLUME_DOWN,
          }))
        );

        if (currentIndicators.volume.avgVolume) {
          const avgSeries = chart.addSeries(LineSeries, {
            color: '#0EA5E9aa',
            lineWidth: 1 as const,
            priceLineVisible: false,
            lastValueVisible: false,
          });
          avgSeries.setData(toLineData(ohlcv, currentIndicators.volume.avgVolume));
          seriesMapRef.current.set('vol_avg', avgSeries);
        }
      }
      seriesMapRef.current.set('vol', volSeries);
    }

    // Stochastic — always create series when STOCHASTIC is active so Phase 2 can populate it
    if (activeIndicators.includes('STOCHASTIC')) {
      const { chart, addRefLine } = createSubPanel('Stoch(%K,%D)');
      addRefLine(80, '#EF444466');
      addRefLine(20, '#22C55E66');
      const kSeries = chart.addSeries(LineSeries, {
        color: STOCH_K,
        lineWidth: 2 as const,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const dSeries = chart.addSeries(LineSeries, {
        color: STOCH_D,
        lineWidth: 1 as const,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      if (currentIndicators.stochastic) {
        kSeries.setData(toLineData(ohlcv, currentIndicators.stochastic.k));
        dSeries.setData(toLineData(ohlcv, currentIndicators.stochastic.d));
      }
      seriesMapRef.current.set('stoch_k', kSeries);
      seriesMapRef.current.set('stoch_d', dSeries);
    }

    // ATR — always create series when ATR is active so Phase 2 can populate it
    if (activeIndicators.includes('ATR')) {
      const { chart } = createSubPanel('ATR(14)');
      const s = chart.addSeries(LineSeries, {
        color: ATR_COLOR,
        lineWidth: 2 as const,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      if (currentIndicators.atr) {
        s.setData(toLineData(ohlcv, currentIndicators.atr.values));
      }
      seriesMapRef.current.set('atr', s);
    }

    // Sync time scales + scroll-back detection
    allChartsRef.current.forEach((chart) => {
      chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range === null) return;

        // Sync all charts
        allChartsRef.current.forEach((other) => {
          if (other !== chart) {
            other.timeScale().setVisibleLogicalRange(range);
          }
        });

        // Trigger historical fetch when user scrolls near the left edge
        // viewportReadyRef guards against firing during initial setVisibleRange
        if (
          viewportReadyRef.current &&
          range.from <= SCROLL_BACK_THRESHOLD &&
          !scrollBackFetchingRef.current &&
          onScrollBackRequestRef.current &&
          ohlcv.length > 0
        ) {
          scrollBackFetchingRef.current = true;
          onScrollBackRequestRef.current(ohlcv[0].timestamp);
        }
      });
    });

    // Pin viewport to the selected range (fresh data), not the full merged array
    // lockVisibleTimeRangeOnResize + rightOffset=0 prevent scrolling into the future
    mainChart.applyOptions({
      timeScale: {
        ...baseChartOptions.timeScale,
        rightOffset: 5,
        lockVisibleTimeRangeOnResize: true,
      },
    });
    const viewportTimes = viewportOhlcv.map((d) => toTime(d.timestamp));
    if (viewportTimes.length >= 2) {
      mainChart.timeScale().setVisibleRange({
        from: viewportTimes[0],
        to: viewportTimes[viewportTimes.length - 1],
      });
    } else {
      mainChart.timeScale().fitContent();
    }
    // Allow scroll-back detection only after initial viewport is set
    setTimeout(() => { viewportReadyRef.current = true; }, 100);

    // ResizeObserver
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const currentSubCount = subChartsRef.current.length;
      const currentSubH = getSubH(h, currentSubCount);
      const newMainH = Math.max(200, h - currentSubCount * currentSubH);
      mainChart.applyOptions({ width: w, height: newMainH });
      subChartsRef.current.forEach((c) => c.applyOptions({ width: w, height: currentSubH }));
    });
    ro.observe(container);

    cleanupRef.current = () => {
      ro.disconnect();
      allChartsRef.current.forEach((c) => { try { c.remove(); } catch { /* ignore */ } });
      mainChartRef.current = null;
      allChartsRef.current = [];
      subChartsRef.current = [];
      seriesMapRef.current.clear();
    };
  }, [ohlcv, signals, activeIndicators]); // ← indicators intentionally excluded

  // Phase 1 — rebuild chart structure when OHLCV / signals / active indicators change
  useEffect(() => {
    buildCharts();
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [buildCharts]);

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 2 — update indicator data independently of chart structure.
  // Depends only on [indicators]. Reads series from seriesMapRef and calls
  // setData without touching chart layout. No cleanup — never destroys charts.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const sMap = seriesMapRef.current;
    if (sMap.size === 0) return; // chart not built yet

    // RSI
    const rsiSeries = sMap.get('rsi');
    if (rsiSeries && indicators.rsi) {
      (rsiSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.rsi.values));
    }

    // MACD histogram
    const macdHistSeries = sMap.get('macd_hist');
    if (macdHistSeries && indicators.macd) {
      const histData = ohlcv
        .map((d, i) => {
          const v = indicators.macd!.histogram[i];
          if (v === null || v === undefined) return null;
          return { time: toTime(d.timestamp), value: v, color: v >= 0 ? MACD_HIST_UP : MACD_HIST_DOWN };
        })
        .filter((d): d is { time: Time; value: number; color: string } => d !== null);
      (macdHistSeries as ISeriesApi<'Histogram'>).setData(histData);
    }

    // MACD line
    const macdLineSeries = sMap.get('macd_line');
    if (macdLineSeries && indicators.macd) {
      (macdLineSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.macd.macd));
    }

    // MACD signal line
    const macdSignalSeries = sMap.get('macd_signal');
    if (macdSignalSeries && indicators.macd) {
      (macdSignalSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.macd.signal));
    }

    // Volume
    const volSeries = sMap.get('vol');
    if (volSeries && indicators.volume) {
      (volSeries as ISeriesApi<'Histogram'>).setData(
        ohlcv.map((d, i) => ({
          time: toTime(d.timestamp),
          value: indicators.volume!.volumes[i],
          color: d.close >= d.open ? VOLUME_UP : VOLUME_DOWN,
        }))
      );
    }

    // Volume average line
    const volAvgSeries = sMap.get('vol_avg');
    if (volAvgSeries && indicators.volume?.avgVolume) {
      (volAvgSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.volume.avgVolume));
    }

    // Stochastic %K
    const stochKSeries = sMap.get('stoch_k');
    if (stochKSeries && indicators.stochastic) {
      (stochKSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.stochastic.k));
    }

    // Stochastic %D
    const stochDSeries = sMap.get('stoch_d');
    if (stochDSeries && indicators.stochastic) {
      (stochDSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.stochastic.d));
    }

    // ATR
    const atrSeries = sMap.get('atr');
    if (atrSeries && indicators.atr) {
      (atrSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.atr.values));
    }

    // Bollinger Bands
    const bollUpperSeries = sMap.get('boll_upper');
    if (bollUpperSeries && indicators.bollinger) {
      (bollUpperSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.bollinger.upper));
    }
    const bollMiddleSeries = sMap.get('boll_middle');
    if (bollMiddleSeries && indicators.bollinger) {
      (bollMiddleSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.bollinger.middle));
    }
    const bollLowerSeries = sMap.get('boll_lower');
    if (bollLowerSeries && indicators.bollinger) {
      (bollLowerSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, indicators.bollinger.lower));
    }

    // EMA — keyed by period
    if (indicators.ema) {
      indicators.ema.forEach((emaResult) => {
        const emaSeries = sMap.get(`ema_${emaResult.period}`);
        if (emaSeries) {
          (emaSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, emaResult.values));
        }
      });
    }

    // SMA — keyed by period
    if (indicators.sma) {
      indicators.sma.forEach((smaResult) => {
        const smaSeries = sMap.get(`sma_${smaResult.period}`);
        if (smaSeries) {
          (smaSeries as ISeriesApi<'Line'>).setData(toLineData(ohlcv, smaResult.values));
        }
      });
    }
  }, [indicators, ohlcv]);

  // Reset scroll-back gate when ohlcv changes (new data was prepended)
  useEffect(() => {
    scrollBackFetchingRef.current = false;
  }, [ohlcv]);

  // Signal highlight effect — no rebuild, just re-render markers
  useEffect(() => {
    const chart = mainChartRef.current;
    if (!chart) return;

    const candleSeries = candleSeriesRef.current;
    const baseMarkers = signalMarkersRef.current;

    if (!selectedSignalTimestamp || ohlcv.length === 0) {
      if (candleSeries && baseMarkers.length > 0) {
        createSeriesMarkers(candleSeries, baseMarkers);
      }
      return;
    }

    const t = toTime(selectedSignalTimestamp) as number;
    const candleTimes = ohlcv.map((c) => toTime(c.timestamp) as number);
    const closest = candleTimes.reduce((best, ct) =>
      Math.abs(ct - t) < Math.abs(best - t) ? ct : best
    );

    if (candleSeries && baseMarkers.length > 0) {
      const updated = baseMarkers.map((m) =>
        (m.time as number) === closest
          ? { ...m, color: '#F59E0B', size: 4, text: `► ${m.text}` }
          : { ...m }
      );
      createSeriesMarkers(candleSeries, updated);
    }

    const idx = candleTimes.indexOf(closest);
    if (idx !== -1) {
      chart.timeScale().setVisibleLogicalRange({
        from: idx - 30,
        to: idx + 30,
      });
    }
  }, [selectedSignalTimestamp, ohlcv]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: CHART_BG }}>
      <div ref={containerRef} className="w-full h-full" />
      {isLoadingMore && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-panel border border-border-subtle text-[10px] font-mono text-text-muted">
          Loading more history…
        </div>
      )}
    </div>
  );
}
