export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withCacheFallback } from "@/lib/cache";
import { fetchForexQuote } from "@/lib/providers/forexProvider";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getRequestIdentity } from "@/lib/http";

const paramsSchema = z.object({ pair: z.string().min(6).max(7) });

export async function GET(request: NextRequest, context: { params: { pair: string } }) {
  try {
    const { pair } = paramsSchema.parse(context.params);
    enforceRateLimit(`forex:${getRequestIdentity(request)}`, 120, 60_000);

    const quote = await withCacheFallback(`forex:${pair}`, 60, () => fetchForexQuote(pair));
    return NextResponse.json({ data: quote });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
