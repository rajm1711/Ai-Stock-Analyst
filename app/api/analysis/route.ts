import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withCacheFallback } from "@/lib/cache";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getRequestIdentity } from "@/lib/http";
import { fetchStockQuote } from "@/lib/providers/stockProvider";
import { fetchFundamentals } from "@/lib/providers/fundamentalProvider";
import { fetchNews } from "@/lib/providers/newsProvider";
import { calculateTechnicalIndicators } from "@/lib/analysis/technical";
import { generateInstitutionalResearch } from "@/lib/ai/researchEngine";

const schema = z.object({ symbol: z.string().min(1).max(10), prices: z.array(z.number()).min(30).optional() });

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    enforceRateLimit(`analysis:${getRequestIdentity(request)}`, 30, 60_000);

    const report = await withCacheFallback(`analysis:${body.symbol}`, 3600, async () => {
      const [quote, fundamentals, news] = await Promise.all([
        fetchStockQuote(body.symbol),
        fetchFundamentals(body.symbol),
        fetchNews(body.symbol)
      ]);
      const prices = body.prices ?? Array.from({ length: 250 }, (_, i) => quote.price * (1 + Math.sin(i / 10) * 0.01));
      const technical = calculateTechnicalIndicators(prices);
      return generateInstitutionalResearch({ symbol: body.symbol, quote, fundamentals, news, technical });
    });

    return NextResponse.json({ data: report });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
