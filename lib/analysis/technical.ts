import { CandlePoint, TechnicalSummary } from "@/types/market";

const average = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

function sma(values: number[], period: number) {
  if (values.length < period) return average(values);
  return average(values.slice(-period));
}

function ema(values: number[], period: number) {
  if (!values.length) return 0;
  const multiplier = 2 / (period + 1);
  return values.slice(1).reduce((prev, val) => prev + multiplier * (val - prev), values[0]);
}

function rsi(values: number[], period = 14): number {
  if (values.length <= period) return 50;
  const changes = values.slice(1).map((v, i) => v - values[i]);
  const sample = changes.slice(-period);
  const gains = average(sample.filter((x) => x > 0));
  const losses = Math.abs(average(sample.filter((x) => x < 0)));
  if (!losses) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function detectLevels(candles: CandlePoint[]) {
  const recent = candles.slice(-60);
  const lows = recent.map((c) => c.low).sort((a, b) => a - b);
  const highs = recent.map((c) => c.high).sort((a, b) => b - a);
  return {
    support: lows[Math.floor(lows.length * 0.2)] ?? 0,
    resistance: highs[Math.floor(highs.length * 0.2)] ?? 0
  };
}

export function summarizeTechnical(candles: CandlePoint[]): TechnicalSummary {
  const closes = candles.map((c) => c.close);
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const sma200 = sma(closes, 200);
  const rsi14 = rsi(closes, 14);
  const macd = ema(closes, 12) - ema(closes, 26);
  const signal = ema(closes.slice(-35), 9);

  const last = closes.at(-1) ?? 0;
  const trend = last > sma50 && sma50 > sma200 ? "bullish" : last < sma50 && sma50 < sma200 ? "bearish" : "sideways";
  const shortTermStructure = last > sma20 ? "above_20sma" : "below_20sma";

  return {
    trend,
    shortTermStructure,
    sma: { sma20, sma50, sma200 },
    rsi14,
    macd: { value: macd, signal, histogram: macd - signal },
    ...detectLevels(candles)
  };
}


export function calculateTechnicalIndicators(prices: number[]) {
  const candles = prices.map((close, index) => ({
    timestamp: new Date(Date.now() - (prices.length - index) * 86400000).toISOString(),
    open: close,
    high: close,
    low: close,
    close,
    volume: 0
  }));
  const summary = summarizeTechnical(candles);
  return {
    sma20: summary.sma.sma20,
    sma50: summary.sma.sma50,
    sma200: summary.sma.sma200,
    rsi: summary.rsi14,
    macd: summary.macd.value,
    signal: summary.macd.signal,
    histogram: summary.macd.histogram,
    support: summary.support,
    resistance: summary.resistance,
    volatility: 0,
    trend: summary.trend
  };
}
