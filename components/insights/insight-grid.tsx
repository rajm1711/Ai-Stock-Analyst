import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const insights = [
  {
    bias: "Long Bias",
    confidence: 74,
    structuralReasoning: "Relative trend strength with improving breadth and stable volatility regime.",
    technicalContext: "Price above 20/50-day averages with constructive pullback profile.",
    riskSummary: "Macro catalyst concentration over upcoming inflation data releases."
  },
  {
    bias: "Short Bias",
    confidence: 68,
    structuralReasoning: "Deteriorating breadth with negative momentum divergence and weakening sector leadership.",
    technicalContext: "Failed retest under key moving averages and declining relative volume quality.",
    riskSummary: "Unexpected policy commentary can trigger sharp bear-covering moves."
  },
  {
    bias: "Neutral Bias",
    confidence: 59,
    structuralReasoning: "Balanced positioning, no clear directional edge in cross-asset confirmation.",
    technicalContext: "Range-bound structure with mixed trend signals across timeframes.",
    riskSummary: "Breakout probability rises into event-driven volatility windows."
  }
];

export function InsightGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {insights.map((insight) => (
        <Card key={insight.bias} title={insight.bias}>
          <p className="mb-2 text-body">Confidence: {insight.confidence}%</p>
          <p className="mb-2 text-body text-slate-700">{insight.structuralReasoning}</p>
          <p className="mb-2 text-body text-slate-700">{insight.technicalContext}</p>
          <p className="mb-4 text-body text-neutral">{insight.riskSummary}</p>
          <Button className="w-full">View Analysis</Button>
        </Card>
      ))}
    </div>
  );
}
