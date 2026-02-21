import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET() {
  try {
    const [totalReportsGenerated, signalRows] = await Promise.all([
      db.savedReport.count(),
      db.signalResult.findMany({ select: { success: true } })
    ]);

    const totalSignals = signalRows.length;
    const successfulSignals = signalRows.filter((row) => row.success).length;
    const winRate = totalSignals ? (successfulSignals / totalSignals) * 100 : 0;

    return NextResponse.json({
      totalReportsGenerated,
      biasAccuracy: winRate,
      winRate
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
