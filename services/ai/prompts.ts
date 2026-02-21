import { RESEARCH_DISCLAIMER } from "@/lib/constants";

export const institutionalGuardrails = [
  "Use a calm institutional tone.",
  "Do not provide financial advice.",
  "Do not issue direct buy or sell instructions.",
  "Avoid hype or emotional language.",
  `Always end long-form research with: \"${RESEARCH_DISCLAIMER}\"`
].join(" ");

export function researchPrompt(symbol: string, assetClass: "equity" | "forex") {
  return `Generate a structured market research report for ${symbol} (${assetClass}). Include: ASSET OVERVIEW, MACRO CONTEXT, FUNDAMENTAL ANALYSIS (stocks) or FOREX STRUCTURE (forex), TECHNICAL STRUCTURE, SENTIMENT ANALYSIS, RISK FACTORS, SCENARIO OUTLOOK, PROBABILITY ASSESSMENT, CONCLUSION, DISCLAIMER.`;
}
