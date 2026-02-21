import { fetchWithRetry } from "@/lib/fetch";
import { ForexQuote } from "@/types/market";

const FOREX_BASE_URL = process.env.FOREX_API_BASE_URL ?? "https://www.alphavantage.co/query";

export async function fetchForexQuote(pair: string): Promise<ForexQuote> {
  const key = process.env.FOREX_API_KEY ?? process.env.STOCK_API_KEY;
  if (!key) throw new Error("FOREX_API_KEY is not configured");

  const [fromSymbol, toSymbol] = pair.replace("/", "").match(/.{1,3}/g) ?? [];
  if (!fromSymbol || !toSymbol) {
    throw new Error("Invalid forex pair format. Use e.g. EUR/USD");
  }

  const query = `${FOREX_BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=${toSymbol}&apikey=${key}`;
  const response = await fetchWithRetry(query, { next: { revalidate: 0 } });
  const payload = await response.json();
  const rate = payload["Realtime Currency Exchange Rate"];
  if (!rate) throw new Error(`Forex provider returned empty quote for ${pair}`);

  return {
    pair: `${fromSymbol}/${toSymbol}`,
    rate: Number(rate["5. Exchange Rate"] ?? 0),
    change: 0,
    percentChange: 0,
    timestamp: String(rate["6. Last Refreshed"] ?? new Date().toISOString())
  };
}
