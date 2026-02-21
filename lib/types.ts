export type AssetClass = "equity" | "forex";

export type ScenarioProbability = {
  scenario: string;
  probability: number;
  rationale: string;
};

export type ResearchReport = {
  asset: string;
  assetClass: AssetClass;
  generatedAt: string;
  sections: Record<string, string>;
  scenarios: ScenarioProbability[];
  disclaimer: string;
};

export type SignalInsight = {
  bias: "Long Bias" | "Short Bias" | "Neutral Bias";
  confidence: number;
  structuralReasoning: string;
  technicalContext: string;
  riskSummary: string;
};
