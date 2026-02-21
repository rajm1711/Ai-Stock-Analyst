import { FundamentalSnapshot, NewsItem, StockQuote, TechnicalSummary } from "@/types/market";

export interface ResearchReport {
  executiveSummary: string;
  primaryTrend: string;
  shortTermStructure: string;
  keySupport: string;
  keyResistance: string;
  fundamentalSnapshot: string;
  newsCatalystSummary: string;
  riskScenario: string;
  bias: "Bullish" | "Bearish" | "Neutral";
  confidenceLevel: string;
  disclaimer: string;
}

export interface ResearchResponse {
  quote: StockQuote;
  technicalSummary: TechnicalSummary;
  fundamentals: FundamentalSnapshot;
  news: NewsItem[];
  aiReport: ResearchReport;
}
