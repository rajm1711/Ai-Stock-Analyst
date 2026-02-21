import { TechnicalIndicators } from "@/types/market";

const average = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / Math.max(values.length, 1);

function sma(values: number[], period: number): number {
  const sample = values.slice(-period);
  return average(sample);
}

function calculateRsi(values: number[], period = 14): number {
  if (values.length <= period) return 50;
  let gains = 0;
  let losses = 0;

  for (let i = values.length - period; i < values.length; i += 1) {
    const diff = values[i] - values[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }

  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function ema(values: number[], period: number): number {
  const multiplier = 2 / (period + 1);
  return values.reduce((prev, price) => (price - prev) * multiplier + prev, values[0] ?? 0);
}

export function calculateTechnicalIndicators(prices: number[]): TechnicalIndicators {
  const sma20 = sma(prices, 20);
  const sma50 = sma(prices, 50);
  const sma200 = sma(prices, 200);
  const rsi = calculateRsi(prices);

  const macd = ema(prices, 12) - ema(prices, 26);
  const signal = ema([...prices.slice(0, -1), macd], 9);
  const histogram = macd - signal;

  const recent = prices.slice(-20);
  const support = Math.min(...recent);
  const resistance = Math.max(...recent);

  const mean = average(recent);
  const variance = average(recent.map((value) => (value - mean) ** 2));
  const volatility = Math.sqrt(variance);

  const last = prices[prices.length - 1] ?? 0;
  const trend = last > sma50 && sma50 > sma200 ? "bullish" : last < sma50 && sma50 < sma200 ? "bearish" : "sideways";

  return { sma20, sma50, sma200, rsi, macd, signal, histogram, support, resistance, volatility, trend };
}
