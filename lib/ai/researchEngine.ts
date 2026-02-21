import OpenAI from "openai";
import { RESEARCH_DISCLAIMER } from "@/lib/constants";
import { FundamentalSnapshot, NewsItem, StockQuote, TechnicalSummary } from "@/types/market";
import { ResearchReport } from "@/types/research";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ResearchPayload {
  symbol: string;
  quote: StockQuote;
  technicalSummary: TechnicalSummary;
  fundamentals: FundamentalSnapshot;
  news: NewsItem[];
}

const defaultReport = (symbol: string): ResearchReport => ({
  executiveSummary: `${symbol} research report unavailable due to AI provider issue.`,
  primaryTrend: "Unavailable",
  shortTermStructure: "Unavailable",
  keySupport: "Unavailable",
  keyResistance: "Unavailable",
  fundamentalSnapshot: "Unavailable",
  newsCatalystSummary: "Unavailable",
  riskScenario: "Model currently unavailable.",
  bias: "Neutral",
  confidenceLevel: "Low",
  disclaimer: RESEARCH_DISCLAIMER
});

export async function generateResearchReport(payload: ResearchPayload): Promise<ResearchReport> {
  if (!process.env.OPENAI_API_KEY) {
    return defaultReport(payload.symbol);
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a professional institutional analyst. Return strict JSON with: executiveSummary, primaryTrend, shortTermStructure, keySupport, keyResistance, fundamentalSnapshot, newsCatalystSummary, riskScenario, bias(Bullish|Bearish|Neutral), confidenceLevel, disclaimer."
        },
        {
          role: "user",
          content: `Build a professional report from this payload: ${JSON.stringify(payload)}`
        }
      ]
    });

    const parsed = JSON.parse(response.output_text) as ResearchReport;
    return { ...parsed, disclaimer: RESEARCH_DISCLAIMER };
  } catch (error) {
    console.error("[researchEngine] OpenAI failure", error);
    return defaultReport(payload.symbol);
  }
}


export const generateInstitutionalResearch = async (payload: { symbol: string; quote: StockQuote; technical: any; fundamentals?: FundamentalSnapshot; news: NewsItem[]; }) => {
  const report = await generateResearchReport({
    symbol: payload.symbol,
    quote: payload.quote,
    technicalSummary: payload.technical,
    fundamentals: payload.fundamentals ?? { symbol: payload.symbol },
    news: payload.news
  });
  return {
    executiveSummary: report.executiveSummary,
    marketOverview: report.primaryTrend,
    technicalAnalysis: report.shortTermStructure,
    fundamentalAnalysis: report.fundamentalSnapshot,
    riskFactors: report.riskScenario,
    scenarioOutlook: { bull: report.primaryTrend, base: report.shortTermStructure, bear: report.riskScenario },
    confidenceLevel: report.confidenceLevel,
    disclaimer: report.disclaimer
  };
};
