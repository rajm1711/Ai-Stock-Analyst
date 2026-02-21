import { FundamentalSnapshot } from "@/types/market";
import { finnhubRequest } from "./client";

interface FinnhubMetricResponse {
  metric?: Record<string, number>;
}

export async function getFundamentals(symbol: string): Promise<FundamentalSnapshot> {
  const payload = await finnhubRequest<FinnhubMetricResponse>({
    path: "/stock/metric",
    params: { symbol: symbol.toUpperCase(), metric: "all" },
    throttleKey: "finnhub:fundamentals"
  });

  const metric = payload.metric ?? {};

  return {
    symbol: symbol.toUpperCase(),
    peRatio: metric.peTTM,
    eps: metric.epsTTM,
    marketCap: metric.marketCapitalization,
    dividendYield: metric.dividendYieldIndicatedAnnual,
    week52High: metric["52WeekHigh"],
    week52Low: metric["52WeekLow"]
  };
}
