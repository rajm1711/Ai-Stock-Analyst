import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCompliantLanguage } from "@/lib/compliance";
import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { fetchStockQuote } from "@/lib/providers/stockProvider";
import { fetchForexQuote } from "@/lib/providers/forexProvider";
import { fetchFundamentals } from "@/lib/providers/fundamentalProvider";
import { fetchNews } from "@/lib/providers/newsProvider";
import { calculateTechnicalIndicators } from "@/lib/analysis/technical";
import { generateInstitutionalResearch } from "@/lib/ai/researchEngine";

const schema = z.object({
  symbol: z.string().min(1),
  assetClass: z.enum(["equity", "forex"]),
  userId: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    enforceRateLimit(`research:${body.userId}`, 60, 60_000);

    const subscription = await prisma.subscription.findUnique({ where: { userId: body.userId } });
    const ttlMs = subscription?.tier === "PREMIUM" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const cached = await prisma.savedReport.findFirst({
      where: { userId: body.userId, symbol: body.symbol, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" }
    });

    if (cached) {
      return NextResponse.json({ ...cached.reportJson, cached: true });
    }

    const prices = Array.from({ length: 250 }, (_, i) => 100 + Math.sin(i / 8) * 3 + i * 0.05);
    const technical = calculateTechnicalIndicators(prices);
    const news = await fetchNews(body.symbol);

    const quote =
      body.assetClass === "equity"
        ? await fetchStockQuote(body.symbol)
        : {
            symbol: body.symbol,
            price: (await fetchForexQuote(body.symbol)).rate,
            change: 0,
            percentChange: 0,
            volume: 0
          };

    const fundamentals = body.assetClass === "equity" ? await fetchFundamentals(body.symbol) : undefined;

    const report = await generateInstitutionalResearch({
      symbol: body.symbol,
      quote,
      fundamentals,
      news,
      technical
    });

    const safeReport = {
      ...report,
      executiveSummary: assertCompliantLanguage(report.executiveSummary),
      marketOverview: assertCompliantLanguage(report.marketOverview),
      technicalAnalysis: assertCompliantLanguage(report.technicalAnalysis),
      fundamentalAnalysis: assertCompliantLanguage(report.fundamentalAnalysis),
      riskFactors: assertCompliantLanguage(report.riskFactors)
    };

    await prisma.savedReport.create({
      data: {
        userId: body.userId,
        symbol: body.symbol,
        reportJson: safeReport,
        expiresAt: new Date(Date.now() + ttlMs)
      }
    });

    await prisma.usageLog.create({ data: { userId: body.userId, endpoint: "/api/research", metadata: { symbol: body.symbol } } });

    return NextResponse.json({ ...safeReport, cached: false });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
