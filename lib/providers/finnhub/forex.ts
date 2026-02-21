import { ForexQuote } from "@/types/market";
import { finnhubRequest, FinnhubError } from "./client";

interface FinnhubForexResponse {
  base: string;
  quote: Record<string, number>;
}

export async function getForexQuote(pair: string): Promise<ForexQuote> {
  const normalized = pair.replace("/", "").toUpperCase();
  const base = normalized.slice(0, 3);
  const quoteSymbol = normalized.slice(3, 6);

  const payload = await finnhubRequest<FinnhubForexResponse>({
    path: "/forex/rates",
    params: { base },
    throttleKey: "finnhub:forex"
  });

  const rate = payload.quote?.[quoteSymbol];
  if (!rate) throw new FinnhubError(`No forex quote data for ${pair}`);

  return {
    pair: `${base}/${quoteSymbol}`,
    rate,
    change: 0,
    percentChange: 0,
    timestamp: new Date().toISOString()
  };
}
