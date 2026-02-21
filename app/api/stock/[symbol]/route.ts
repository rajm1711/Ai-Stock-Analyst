import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withCacheFallback } from "@/lib/cache";
import { fetchStockQuote } from "@/lib/providers/stockProvider";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getRequestIdentity } from "@/lib/http";

const paramsSchema = z.object({ symbol: z.string().min(1).max(10) });

export async function GET(request: NextRequest, context: { params: { symbol: string } }) {
  try {
    const { symbol } = paramsSchema.parse(context.params);
    enforceRateLimit(`stock:${getRequestIdentity(request)}`, 120, 60_000);

    const quote = await withCacheFallback(`stock:${symbol}`, 60, () => fetchStockQuote(symbol));
    return NextResponse.json({ data: quote });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
