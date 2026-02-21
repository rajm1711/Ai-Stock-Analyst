export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withCacheFallback } from "@/lib/cache";
import { fetchNews } from "@/lib/providers/newsProvider";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getRequestIdentity } from "@/lib/http";

const paramsSchema = z.object({ symbol: z.string().min(1).max(10) });

export async function GET(request: NextRequest, context: { params: { symbol: string } }) {
  try {
    const { symbol } = paramsSchema.parse(context.params);
    enforceRateLimit(`news:${getRequestIdentity(request)}`, 60, 60_000);

    const news = await withCacheFallback(`news:${symbol}`, 600, () => fetchNews(symbol));
    return NextResponse.json({ data: news });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
