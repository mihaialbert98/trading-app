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
  ohlcv: OHLCV[];
  signals: SignalEvent[];
  indicators: IndicatorsData;
  activeIndicators: IndicatorType[];
}

function toTime(ts: number): Time {
  return Math.floor(ts / 1000) as Time;
}

function toLineData(ohlcv: OHLCV[], values: (number | null)[]) {
  return ohlcv
    .map((d, i) => ({ time: toTime(d.timestamp), value: values[i] }))
    .filter((d): d is { time: Time; value: number } => d.value !== null && d.value !== undefined);
}

export default function ChartCore({ ohlcv, signals, indicators, activeIndicators }: ChartCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const buildCharts = useCallback(() => {
    if (!containerRef.current || ohlcv.length === 0) return;

    // Cleanup previous
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    containerRef.current.innerHTML = '';

    const container = containerRef.current;
    const totalWidth = container.clientWidth;

    const subPanels: IndicatorType[] = (['RSI', 'MACD', 'VOLUME', 'STOCHASTIC', 'ATR'] as IndicatorType[]).filter(
      (p) => activeIndicators.includes(p)
    );

    const SUB_H = 100;
    const totalHeight = container.clientHeight;
    const mainHeight = Math.max(200, totalHeight - subPanels.length * SUB_H);

    const baseChartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: CHART_BG },
        textColor: TEXT_COLOR,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
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

    const allCharts: IChartApi[] = [];

    // ── Main chart ──
    const mainWrapper = document.createElement('div');
    mainWrapper.style.cssText = `width:100%;height:${mainHeight}px;`;
    container.appendChild(mainWrapper);

    const mainChart = createChart(mainWrapper, {
      ...baseChartOptions,
      width: totalWidth,
      height: mainHeight,
    });
    allCharts.push(mainChart);

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

    // Bollinger Bands overlay
    if (activeIndicators.includes('BOLLINGER') && indicators.bollinger) {
      const lineOpts = { lineWidth: 1 as const, priceLineVisible: false, lastValueVisible: false };
      const upperSeries = mainChart.addSeries(LineSeries, { ...lineOpts, color: BOLL_UPPER, lineStyle: LineStyle.Dashed });
      const middleSeries = mainChart.addSeries(LineSeries, { ...lineOpts, color: BOLL_MIDDLE, lineStyle: LineStyle.Dotted });
      const lowerSeries = mainChart.addSeries(LineSeries, { ...lineOpts, color: BOLL_LOWER, lineStyle: LineStyle.Dashed });
      upperSeries.setData(toLineData(ohlcv, indicators.bollinger.upper));
      middleSeries.setData(toLineData(ohlcv, indicators.bollinger.middle));
      lowerSeries.setData(toLineData(ohlcv, indicators.bollinger.lower));
    }

    // EMA overlays
    if (activeIndicators.includes('EMA') && indicators.ema) {
      indicators.ema.forEach((emaResult, idx) => {
        const color = EMA_COLORS[idx % EMA_COLORS.length];
        const s = mainChart.addSeries(LineSeries, {
          color,
          lineWidth: 1 as const,
          priceLineVisible: false,
          lastValueVisible: true,
          title: `EMA${emaResult.period}`,
        });
        s.setData(toLineData(ohlcv, emaResult.values));
      });
    }

    // SMA overlays
    if (activeIndicators.includes('SMA') && indicators.sma) {
      indicators.sma.forEach((smaResult, idx) => {
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
      });
    }

    // Signal markers — snap signal timestamp to nearest candle time
    if (signals.length > 0) {
      const candleTimes = candleData.map((c) => c.time as number);
      const markers: SeriesMarker<Time>[] = signals
        .map((sig): SeriesMarker<Time> | null => {
          const t = toTime(sig.timestamp);
          // Find closest candle time (handles weekend/holiday offsets)
          const closest = candleTimes.reduce((best, ct) =>
            Math.abs(ct - (t as number)) < Math.abs(best - (t as number)) ? ct : best
          );
          // Skip if more than 5 trading days away (data mismatch)
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
      }
    }

    // ── Sub-panel factory ──
    const subCharts: IChartApi[] = [];

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
      subCharts.push(chart);
      allCharts.push(chart);

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

    // RSI
    if (activeIndicators.includes('RSI') && indicators.rsi) {
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
      s.setData(toLineData(ohlcv, indicators.rsi.values));
    }

    // MACD
    if (activeIndicators.includes('MACD') && indicators.macd) {
      const { chart, addRefLine } = createSubPanel('MACD(12,26,9)');
      addRefLine(0, '#64748b88');

      const histSeries = chart.addSeries(HistogramSeries, {
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const histData = ohlcv
        .map((d, i) => {
          const v = indicators.macd!.histogram[i];
          if (v === null || v === undefined) return null;
          return { time: toTime(d.timestamp), value: v, color: v >= 0 ? MACD_HIST_UP : MACD_HIST_DOWN };
        })
        .filter((d): d is { time: Time; value: number; color: string } => d !== null);
      histSeries.setData(histData);

      const macdLine = chart.addSeries(LineSeries, {
        color: MACD_LINE_COLOR,
        lineWidth: 2 as const,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      macdLine.setData(toLineData(ohlcv, indicators.macd.macd));

      const signalLine = chart.addSeries(LineSeries, {
        color: MACD_SIGNAL_COLOR,
        lineWidth: 1 as const,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      signalLine.setData(toLineData(ohlcv, indicators.macd.signal));
    }

    // Volume
    if (activeIndicators.includes('VOLUME') && indicators.volume) {
      const { chart } = createSubPanel('Volume');
      const volSeries = chart.addSeries(HistogramSeries, {
        priceLineVisible: false,
        lastValueVisible: false,
      });
      volSeries.setData(
        ohlcv.map((d, i) => ({
          time: toTime(d.timestamp),
          value: indicators.volume!.volumes[i],
          color: d.close >= d.open ? VOLUME_UP : VOLUME_DOWN,
        }))
      );

      if (indicators.volume.avgVolume) {
        const avgSeries = chart.addSeries(LineSeries, {
          color: '#0EA5E9aa',
          lineWidth: 1 as const,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        avgSeries.setData(toLineData(ohlcv, indicators.volume.avgVolume));
      }
    }

    // Stochastic
    if (activeIndicators.includes('STOCHASTIC') && indicators.stochastic) {
      const { chart, addRefLine } = createSubPanel('Stoch(%K,%D)');
      addRefLine(80, '#EF444466');
      addRefLine(20, '#22C55E66');
      const kSeries = chart.addSeries(LineSeries, {
        color: STOCH_K,
        lineWidth: 2 as const,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      kSeries.setData(toLineData(ohlcv, indicators.stochastic.k));
      const dSeries = chart.addSeries(LineSeries, {
        color: STOCH_D,
        lineWidth: 1 as const,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      dSeries.setData(toLineData(ohlcv, indicators.stochastic.d));
    }

    // ATR
    if (activeIndicators.includes('ATR') && indicators.atr) {
      const { chart } = createSubPanel('ATR(14)');
      const s = chart.addSeries(LineSeries, {
        color: ATR_COLOR,
        lineWidth: 2 as const,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      s.setData(toLineData(ohlcv, indicators.atr.values));
    }

    // Sync time scales
    allCharts.forEach((chart) => {
      chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range === null) return;
        allCharts.forEach((other) => {
          if (other !== chart) {
            other.timeScale().setVisibleLogicalRange(range);
          }
        });
      });
    });

    mainChart.timeScale().fitContent();

    // ResizeObserver
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const newMainH = Math.max(200, h - subPanels.length * SUB_H);
      mainChart.applyOptions({ width: w, height: newMainH });
      subCharts.forEach((c) => c.applyOptions({ width: w }));
    });
    ro.observe(container);

    cleanupRef.current = () => {
      ro.disconnect();
      allCharts.forEach((c) => { try { c.remove(); } catch { /* ignore */ } });
    };
  }, [ohlcv, signals, indicators, activeIndicators]);

  useEffect(() => {
    buildCharts();
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [buildCharts]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden"
      style={{ background: CHART_BG }}
    />
  );
}
