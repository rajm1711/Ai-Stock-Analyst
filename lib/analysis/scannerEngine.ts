import { withCacheFallback } from "@/lib/cache/cache";
import { summarizeTechnical } from "@/lib/analysis/technical";
import { getStockCandles, getStockQuote } from "@/lib/providers/finnhub/stocks";
import { ScannerResult, ScannerType } from "@/types/market";

const TOP_SYMBOLS = [
  "AAPL","MSFT","NVDA","AMZN","META","GOOGL","GOOG","TSLA","BRK.B","UNH","XOM","JPM","JNJ","V","PG","AVGO","MA","HD","CVX","MRK",
  "ABBV","PEP","COST","KO","ADBE","BAC","WMT","MCD","CSCO","CRM","ACN","PFE","NFLX","LIN","TMO","ABT","CMCSA","ORCL","WFC","AMD",
  "DHR","DIS","TXN","VZ","PM","NEE","INTC","QCOM","RTX","HON","AMGN","LOW","INTU","UNP","IBM","SPGI","CAT","GS","NOW","BKNG",
  "GE","DE","BLK","MDLZ","ADP","AXP","CI","CB","SYK","AMAT","LMT","ISRG","TJX","GILD","MMC","NKE","C","ELV","VRTX","MO",
  "PLD","ZTS","TMUS","SO","PANW","TGT","COP","USB","PGR","SCHW","DUK","CSX","FIS","AON","CL","EOG","MS","REGN","BDX","SNPS"
];

function matchScanner(type: ScannerType, input: { price: number; volume: number; support: number; resistance: number; trend: string; rsi: number }) {
  if (type === "breakout") return input.price > input.resistance * 0.998;
  if (type === "pullback") return input.trend === "bullish" && input.price <= input.support * 1.02;
  if (type === "high-volume") return input.volume > 1_000_000;
  return input.trend === "bullish" && input.rsi > 50 && input.rsi < 70;
}

export async function runScanner(type: ScannerType): Promise<ScannerResult[]> {
  const now = Math.floor(Date.now() / 1000);
  const from = now - 180 * 24 * 60 * 60;

  const rows = await Promise.all(
    TOP_SYMBOLS.map(async (symbol) => {
      const [quote, candles] = await Promise.all([
        withCacheFallback(`quote:${symbol}`, 60, () => getStockQuote(symbol)),
        withCacheFallback(`candles:${symbol}`, 300, () => getStockCandles(symbol, "D", from, now))
      ]);
      const technical = summarizeTechnical(candles);
      const pass = matchScanner(type, {
        price: quote.price,
        volume: quote.volume,
        support: technical.support,
        resistance: technical.resistance,
        trend: technical.trend,
        rsi: technical.rsi14
      });
      if (!pass) return null;
      return {
        symbol,
        score: Math.abs((quote.price - technical.support) / Math.max(technical.support, 1)),
        lastPrice: quote.price,
        trend: technical.trend,
        reason: `${type} setup with RSI ${technical.rsi14.toFixed(1)} and trend ${technical.trend}`
      } satisfies ScannerResult;
    })
  );

  return rows.filter((item): item is ScannerResult => Boolean(item)).sort((a, b) => b.score - a.score).slice(0, 10);
}
