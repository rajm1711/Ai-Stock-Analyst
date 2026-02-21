import { getStockQuote } from "@/lib/providers/finnhub/stocks";

export const fetchStockQuote = getStockQuote;

export async function fetchTopMovers(symbols: string[]) {
  return Promise.all(symbols.map((symbol) => getStockQuote(symbol)));
}
