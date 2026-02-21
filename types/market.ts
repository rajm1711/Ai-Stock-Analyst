export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap?: number;
}

export interface ForexQuote {
  pair: string;
  rate: number;
  change: number;
  percentChange: number;
  timestamp: string;
}

export interface FundamentalSnapshot {
  symbol: string;
  peRatio?: number;
  eps?: number;
  marketCap?: number;
  dividendYield?: number;
  week52High?: number;
  week52Low?: number;
}

export interface NewsItem {
  id: string;
  symbol: string;
  headline: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: "positive" | "neutral" | "negative";
}

export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  rsi: number;
  macd: number;
  signal: number;
  histogram: number;
  support: number;
  resistance: number;
  volatility: number;
  trend: "bullish" | "bearish" | "sideways";
}
