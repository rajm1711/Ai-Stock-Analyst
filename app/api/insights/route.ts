import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateSignalInsight } from "@/services/ai";

const insightSchema = z.object({ symbol: z.string().min(1) });

export async function GET(request: NextRequest) {
  try {
    const symbol = request.nextUrl.searchParams.get("symbol") ?? "AAPL";
    const data = insightSchema.parse({ symbol });
    const insights = await generateSignalInsight(data.symbol);
    return NextResponse.json({ insights });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = insightSchema.parse(await request.json());
    const insights = await generateSignalInsight(body.symbol);
    return NextResponse.json({ insights });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
