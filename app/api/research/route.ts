import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateResearchReport } from "@/services/ai";
import { assertCompliantLanguage } from "@/lib/compliance";
import { enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  symbol: z.string().min(1),
  assetClass: z.enum(["equity", "forex"]),
  userId: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    enforceRateLimit(`research:${body.userId}`, 60, 60_000);
    const report = await generateResearchReport(body.symbol, body.assetClass);
    const safeSections = Object.fromEntries(
      Object.entries(report.sections).map(([key, value]) => [key, assertCompliantLanguage(value)])
    );

    return NextResponse.json({ ...report, sections: safeSections });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
