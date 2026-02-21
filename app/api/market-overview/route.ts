import { NextResponse } from "next/server";
import { withCacheFallback } from "@/lib/cache/cache";
import { getStockQuote } from "@/lib/providers/finnhub/stocks";

const MARKET_MAP = {
  SPY: "SPY",
  QQQ: "QQQ",
  DIA: "DIA",
  IWM: "IWM",
  DXY: "DXY",
  VIX: "VIX"
} as const;

export async function GET() {
  try {
    const entries = await Promise.all(
      Object.entries(MARKET_MAP).map(async ([key, symbol]) => {
        const quote = await withCacheFallback(`quote:${symbol}`, 60, () => getStockQuote(symbol));
        return [key, quote] as const;
      })
    );

    return NextResponse.json(Object.fromEntries(entries));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
