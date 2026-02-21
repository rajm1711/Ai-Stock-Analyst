"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RESEARCH_DISCLAIMER } from "@/lib/constants";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const defaultSections = [
  "ASSET OVERVIEW",
  "MACRO CONTEXT",
  "FUNDAMENTAL ANALYSIS / FOREX STRUCTURE",
  "TECHNICAL STRUCTURE",
  "SENTIMENT ANALYSIS",
  "RISK FACTORS",
  "SCENARIO OUTLOOK",
  "PROBABILITY ASSESSMENT",
  "CONCLUSION"
];

export function ResearchWorkbench() {
  const [symbol, setSymbol] = useState("AAPL");
  const [assetClass, setAssetClass] = useState<"equity" | "forex">("equity");
  const debouncedSymbol = useDebouncedValue(symbol, 350);

  return (
    <section className="grid grid-cols-12 gap-6">
      <Card className="col-span-12 h-fit lg:col-span-4" title="Asset Configuration">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-body text-neutral">Asset Class</label>
            <select
              value={assetClass}
              onChange={(event) => setAssetClass(event.target.value as "equity" | "forex")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              <option value="equity">US Equity</option>
              <option value="forex">Forex Pair</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-body text-neutral">Symbol</label>
            <input
              value={symbol}
              onChange={(event) => setSymbol(event.target.value.toUpperCase())}
              placeholder="AAPL or EUR/USD"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <p className="mt-2 text-xs text-neutral">Debounced query: {debouncedSymbol}</p>
          </div>
          <Button className="w-full">Generate Research Report</Button>
        </div>
      </Card>

      <Card className="col-span-12 max-h-[640px] overflow-y-auto lg:col-span-8" title="AI Research Output">
        <div className="space-y-4">
          {defaultSections.map((section) => (
            <article key={section} className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-2 text-body font-semibold text-primary">{section}</h3>
              <p className="text-body text-slate-700">
                Structured institutional commentary will be rendered here after API generation. Content is probability-based,
                scenario-oriented, and strictly non-advisory.
              </p>
            </article>
          ))}
          <p className="rounded-xl bg-slate-100 p-4 text-body text-neutral">{RESEARCH_DISCLAIMER}</p>
        </div>
      </Card>
    </section>
  );
}
