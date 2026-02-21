"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RESEARCH_DISCLAIMER } from "@/lib/constants";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function ResearchWorkbench() {
  const [symbol, setSymbol] = useState("AAPL");
  const [assetClass, setAssetClass] = useState<"equity" | "forex">("equity");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debouncedSymbol = useDebouncedValue(symbol, 350);

  async function generateReport() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: debouncedSymbol, assetClass, userId: "demo-user" })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to generate report");
      setReport(data);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid grid-cols-12 gap-6">
      <Card className="col-span-12 h-fit lg:col-span-4" title="Asset Configuration">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-body text-neutral">Asset Class</label>
            <select value={assetClass} onChange={(event) => setAssetClass(event.target.value as "equity" | "forex")} className="w-full rounded-xl border border-slate-300 px-3 py-2">
              <option value="equity">US Equity</option>
              <option value="forex">Forex Pair</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-body text-neutral">Symbol</label>
            <input value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} placeholder="AAPL or EURUSD" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
          <Button className="w-full" onClick={generateReport} disabled={loading}>{loading ? "Generating..." : "Generate Research Report"}</Button>
        </div>
      </Card>

      <Card className="col-span-12 max-h-[640px] overflow-y-auto lg:col-span-8" title="AI Research Output">
        {error ? <p className="text-red-600">{error}</p> : null}
        {!report ? <p className="text-body text-slate-700">No report generated yet.</p> : (
          <div className="space-y-4">
            {Object.entries(report)
              .filter(([key]) => key !== "disclaimer" && key !== "cached")
              .map(([key, value]) => (
                <article key={key} className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-2 text-body font-semibold text-primary">{key}</h3>
                  <pre className="whitespace-pre-wrap text-body text-slate-700">{typeof value === "string" ? value : JSON.stringify(value, null, 2)}</pre>
                </article>
              ))}
          </div>
        )}
        <p className="mt-4 rounded-xl bg-slate-100 p-4 text-body text-neutral">{RESEARCH_DISCLAIMER}</p>
      </Card>
    </section>
  );
}
