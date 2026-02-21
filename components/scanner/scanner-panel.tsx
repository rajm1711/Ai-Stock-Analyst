"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ScannerPanel() {
  const [timeframe, setTimeframe] = useState("1D");
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [explanation, setExplanation] = useState("");

  async function runScan() {
    const response = await fetch("/api/scanner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timeframe, confidenceThreshold, signals: [] })
    });
    const data = await response.json();
    setExplanation(data.explanation ?? data.error ?? "No response");
  }

  return (
    <div className="section-gap">
      <Card title="Scanner Filters" subtitle="Configure timeframe and confidence thresholds">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select className="rounded-xl border border-slate-300 px-3 py-2" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option>1H</option><option>4H</option><option>1D</option>
          </select>
          <input type="range" min={50} max={95} value={confidenceThreshold} onChange={(e) => setConfidenceThreshold(Number(e.target.value))} className="w-full" />
          <Button onClick={runScan}>Run Quantitative Scan</Button>
        </div>
      </Card>

      <Card title="Structured Scan Results">
        <p className="whitespace-pre-wrap text-body text-slate-700">{explanation || "Run scan to generate AI explanation from live inputs."}</p>
      </Card>
    </div>
  );
}
