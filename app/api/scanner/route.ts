import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateScannerExplanation } from "@/services/ai";

const scannerSchema = z.object({
  timeframe: z.enum(["1H", "4H", "1D"]),
  confidenceThreshold: z.number().min(0).max(100),
  signals: z.array(z.record(z.unknown())).default([])
});

export async function POST(request: NextRequest) {
  try {
    const payload = scannerSchema.parse(await request.json());
    const explanation = await generateScannerExplanation(payload);
    return NextResponse.json({ explanation });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
