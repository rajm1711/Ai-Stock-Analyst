import { NextRequest, NextResponse } from "next/server";
import { withCacheFallback } from "@/lib/cache/cache";
import { getStockCandles, getStockQuote } from "@/lib/providers/finnhub/stocks";
import { getFundamentals } from "@/lib/providers/finnhub/fundamentals";
import { getCompanyNews } from "@/lib/providers/finnhub/news";
import { summarizeTechnical } from "@/lib/analysis/technical";
import { generateResearchReport } from "@/lib/ai/researchEngine";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET(request: NextRequest, context: { params: { symbol: string } }) {
  const symbol = context.params.symbol.toUpperCase();

  try {
    const now = Math.floor(Date.now() / 1000);
    const from6M = now - 180 * 24 * 60 * 60;

    const [quote, candles, fundamentals, news] = await Promise.all([
      withCacheFallback(`quote:${symbol}`, 60, () => getStockQuote(symbol)),
      withCacheFallback(`candles:${symbol}:6m`, 300, () => getStockCandles(symbol, "D", from6M, now)),
      withCacheFallback(`fundamentals:${symbol}`, 24 * 60 * 60, () => getFundamentals(symbol)),
      withCacheFallback(`news:${symbol}`, 10 * 60, () => getCompanyNews(symbol))
    ]);

    const technicalSummary = summarizeTechnical(candles);
    const aiReport = await withCacheFallback(`report:${symbol}`, 60 * 60, () =>
      generateResearchReport({ symbol, quote, technicalSummary, fundamentals, news })
    );

    await db.savedReport.create({
      data: {
        symbol,
        bias: aiReport.bias,
        confidence: aiReport.confidenceLevel,
        reportContent: JSON.stringify(aiReport),
        reportJson: aiReport as unknown as object,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        userId: request.headers.get("x-user-id") ?? "system"
      }
    }).catch(() => undefined);

    return NextResponse.json({ quote, technicalSummary, fundamentals, news, aiReport });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
