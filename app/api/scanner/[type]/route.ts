import { NextResponse } from "next/server";
import { runScanner } from "@/lib/analysis/scannerEngine";
import { ScannerType } from "@/types/market";

const TYPES: ScannerType[] = ["breakout", "pullback", "high-volume", "trend-continuation"];

export async function GET(_: Request, context: { params: { type: string } }) {
  const type = context.params.type as ScannerType;
  if (!TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid scanner type" }, { status: 400 });
  }

  try {
    const results = await runScanner(type);
    return NextResponse.json({ type, results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
