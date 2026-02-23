export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "https://api.yourdomain.com";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}) for ${path}`);
  }

  return response.json() as Promise<T>;
}

export type MarketOverview = {
  marketIndices: Array<{ symbol: string; price: number; change: number; changePercent: number }>;
  dxy: { value: number; change: number };
  vix: { value: number; change: number };
  marketBiasSummary: string;
  latestAiOverview: string;
  topScannerSignals: Array<{ symbol: string; signal: string; confidence: number }>;
};

export type ResearchPayload = {
  quote: { symbol: string; price: number; changePercent: number };
  candles: Array<{ time: string; open: number; high: number; low: number; close: number }>;
  indicators: {
    ema50: Array<{ time: string; value: number }>;
    ema200: Array<{ time: string; value: number }>;
    rsi: Array<{ time: string; value: number }>;
  };
  technicalSummary: {
    support: number[];
    resistance: number[];
    trend: string;
    summary: string;
  };
  fundamentals: Record<string, string | number>;
  news: Array<{ id: string; title: string; summary: string; publishedAt: string; source: string }>;
  aiReport: string;
};

export type ScannerResult = {
  symbol: string;
  signalType: string;
  trendDirection: string;
  rsi: number;
  volumeSpike: number;
};

export type NewsPayload = {
  symbol: string;
  catalystOverview: string;
  news: Array<{ id: string; title: string; summary: string; source: string; publishedAt: string }>;
};

export const api = {
  getMarketOverview: () => request<MarketOverview>("/market-overview"),
  getResearch: (symbol: string) => request<ResearchPayload>(`/research/${symbol}`),
  getScanner: (type: string) => request<ScannerResult[]>(`/scanner?type=${encodeURIComponent(type)}`),
  getNews: (symbol: string) => request<NewsPayload>(`/news/${symbol}`)
};
