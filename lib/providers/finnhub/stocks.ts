import { CandlePoint, StockQuote } from "@/types/market";
import { finnhubRequest, FinnhubError } from "./client";

interface FinnhubQuoteResponse {
  c: number;
  d: number;
  dp: number;
  t: number;
  v?: number;
}

interface FinnhubCandlesResponse {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
  s: string;
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const payload = await finnhubRequest<FinnhubQuoteResponse>({
    path: "/quote",
    params: { symbol: symbol.toUpperCase() },
    throttleKey: "finnhub:quote"
  });

  if (!payload.c) throw new FinnhubError(`No stock quote data for ${symbol}`);

  return {
    symbol: symbol.toUpperCase(),
    price: payload.c,
    change: payload.d,
    percentChange: payload.dp,
    volume: payload.v ?? 0
  };
}

export async function getStockCandles(symbol: string, resolution: string, from: number, to: number): Promise<CandlePoint[]> {
  const payload = await finnhubRequest<FinnhubCandlesResponse>({
    path: "/stock/candle",
    params: { symbol: symbol.toUpperCase(), resolution, from, to },
    throttleKey: "finnhub:candles"
  });

  if (payload.s !== "ok") throw new FinnhubError(`No candle data for ${symbol}`);

  return payload.t.map((timestamp, index) => ({
    timestamp: new Date(timestamp * 1000).toISOString(),
    open: payload.o[index] ?? 0,
    high: payload.h[index] ?? 0,
    low: payload.l[index] ?? 0,
    close: payload.c[index] ?? 0,
    volume: payload.v[index] ?? 0
  }));
}
