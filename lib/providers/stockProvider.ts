import { fetchWithRetry } from "@/lib/fetch";
import { StockQuote } from "@/types/market";

const STOCK_BASE_URL = process.env.STOCK_API_BASE_URL ?? "https://www.alphavantage.co/query";

function parseNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  const key = process.env.STOCK_API_KEY;
  if (!key) {
    throw new Error("STOCK_API_KEY is not configured");
  }

  const query = `${STOCK_BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
  const response = await fetchWithRetry(query, { next: { revalidate: 0 } });
  const payload = await response.json();
  const quote = payload["Global Quote"];
  if (!quote) throw new Error(`Stock provider returned empty quote for ${symbol}`);

  return {
    symbol: String(quote["01. symbol"] ?? symbol).toUpperCase(),
    price: parseNumber(quote["05. price"]),
    change: parseNumber(quote["09. change"]),
    percentChange: parseNumber(String(quote["10. change percent"] ?? "0").replace("%", "")),
    volume: parseNumber(quote["06. volume"]),
    marketCap: undefined
  };
}

export async function fetchTopMovers(symbols: string[]): Promise<StockQuote[]> {
  return Promise.all(symbols.map((symbol) => fetchStockQuote(symbol)));
}
