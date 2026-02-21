import { fetchWithRetry } from "@/lib/fetch";
import { FundamentalSnapshot } from "@/types/market";

const FUNDAMENTAL_BASE_URL = process.env.FUNDAMENTAL_API_BASE_URL ?? "https://www.alphavantage.co/query";

function maybeNum(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export async function fetchFundamentals(symbol: string): Promise<FundamentalSnapshot> {
  const key = process.env.STOCK_API_KEY;
  if (!key) throw new Error("STOCK_API_KEY is not configured");

  const query = `${FUNDAMENTAL_BASE_URL}?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
  const response = await fetchWithRetry(query, { next: { revalidate: 0 } });
  const payload = await response.json();

  return {
    symbol,
    peRatio: maybeNum(payload.PERatio),
    eps: maybeNum(payload.EPS),
    marketCap: maybeNum(payload.MarketCapitalization),
    dividendYield: maybeNum(payload.DividendYield),
    week52High: maybeNum(payload["52WeekHigh"]),
    week52Low: maybeNum(payload["52WeekLow"])
  };
}
