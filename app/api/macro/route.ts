import { NextResponse } from "next/server";
import { generateMacroSummary } from "@/services/ai";

export async function GET() {
  try {
    const summary = await generateMacroSummary();
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
