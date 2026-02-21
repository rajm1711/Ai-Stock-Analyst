"use client";

import useSWR from "swr";
import { Card } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function InsightGrid() {
  const { data } = useSWR("/api/insights?symbol=AAPL", fetcher, { refreshInterval: 300_000 });
  const insights = data?.insights ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {insights.map((insight: { bias: string; confidence: number; structuralReasoning: string; technicalContext: string; riskSummary: string }) => (
        <Card key={insight.bias} title={insight.bias}>
          <p className="mb-2 text-body">Confidence: {insight.confidence}%</p>
          <p className="mb-2 text-body text-slate-700">{insight.structuralReasoning}</p>
          <p className="mb-2 text-body text-slate-700">{insight.technicalContext}</p>
          <p className="mb-4 text-body text-neutral">{insight.riskSummary}</p>
        </Card>
      ))}
    </div>
  );
}
