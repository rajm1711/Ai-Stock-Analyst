import OpenAI from "openai";
import { RESEARCH_DISCLAIMER } from "@/lib/constants";
import { institutionalGuardrails, researchPrompt } from "@/services/ai/prompts";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateStructuredText(userPrompt: string) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: institutionalGuardrails },
      { role: "user", content: userPrompt }
    ]
  });

  return response.output_text;
}

export async function generateResearchReport(symbol: string, assetClass: "equity" | "forex") {
  if (!process.env.OPENAI_API_KEY) {
    return {
      asset: symbol,
      assetClass,
      generatedAt: new Date().toISOString(),
      sections: {
        "ASSET OVERVIEW": "OpenAI key missing; returning compliant fallback report.",
        "MACRO CONTEXT": "Macro synthesis unavailable in fallback mode.",
        DISCLAIMER: RESEARCH_DISCLAIMER
      },
      scenarios: [],
      disclaimer: RESEARCH_DISCLAIMER
    };
  }

  const report = await generateStructuredText(researchPrompt(symbol, assetClass));
  return {
    asset: symbol,
    assetClass,
    generatedAt: new Date().toISOString(),
    sections: { REPORT: report },
    scenarios: [],
    disclaimer: RESEARCH_DISCLAIMER
  };
}

export async function generateSignalInsight(symbol: string) {
  return generateStructuredText(`Provide long bias, short bias, and neutral bias insight blocks for ${symbol} with confidence percentages, structural reasoning, technical context, and risk summary.`);
}

export async function generateMacroSummary() {
  return generateStructuredText("Provide a macro-aware summary for US equities and major forex pairs, highlighting policy, growth, inflation, and liquidity regimes.");
}

export async function generateScannerExplanation(payload: unknown) {
  return generateStructuredText(`Explain scanner output in institutional language without financial advice. Input: ${JSON.stringify(payload)}`);
}
