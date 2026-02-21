import OpenAI from "openai";
import { FundamentalSnapshot, NewsItem, StockQuote, TechnicalIndicators } from "@/types/market";
import { RESEARCH_DISCLAIMER } from "@/lib/constants";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ResearchPayload {
  symbol: string;
  quote: StockQuote;
  technical: TechnicalIndicators;
  fundamentals?: FundamentalSnapshot;
  news: NewsItem[];
}

export interface InstitutionalReport {
  executiveSummary: string;
  marketOverview: string;
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  riskFactors: string;
  scenarioOutlook: {
    bull: string;
    base: string;
    bear: string;
  };
  confidenceLevel: string;
  disclaimer: string;
}

export async function generateInstitutionalResearch(payload: ResearchPayload): Promise<InstitutionalReport> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      executiveSummary: `Live AI is unavailable for ${payload.symbol}.`,
      marketOverview: "OpenAI key missing.",
      technicalAnalysis: "Technical engine ran successfully; narrative generation unavailable.",
      fundamentalAnalysis: "Fundamental narrative unavailable.",
      riskFactors: "Provider/API downtime and macro event risk.",
      scenarioOutlook: {
        bull: "Bull case unavailable.",
        base: "Base case unavailable.",
        bear: "Bear case unavailable."
      },
      confidenceLevel: "Low",
      disclaimer: RESEARCH_DISCLAIMER
    };
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are an institutional sell-side strategist. Tone must be professional and objective (Goldman Sachs style). Never give direct buy/sell advice. Output valid JSON only."
      },
      {
        role: "user",
        content: `Create research report JSON with keys: executiveSummary, marketOverview, technicalAnalysis, fundamentalAnalysis, riskFactors, scenarioOutlook:{bull,base,bear}, confidenceLevel, disclaimer. Data: ${JSON.stringify(payload)}`
      }
    ]
  });

  const text = response.output_text;
  const parsed = JSON.parse(text) as InstitutionalReport;
  return { ...parsed, disclaimer: RESEARCH_DISCLAIMER };
}
