import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const rows = [
  { asset: "NVDA", bias: "Long Bias", confidence: "78%", metric: "Volume +168%, RSI 66" },
  { asset: "EUR/USD", bias: "Neutral Bias", confidence: "61%", metric: "MA compression, RSI 50" },
  { asset: "TSLA", bias: "Short Bias", confidence: "72%", metric: "Breakdown below 50DMA" }
];

export function ScannerPanel() {
  return (
    <div className="section-gap">
      <Card title="Scanner Filters" subtitle="Configure timeframe and confidence thresholds">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select className="rounded-xl border border-slate-300 px-3 py-2">
            <option>1H</option>
            <option>4H</option>
            <option>1D</option>
          </select>
          <input type="range" min={50} max={95} defaultValue={70} className="w-full" />
          <Button>Run Quantitative Scan</Button>
        </div>
      </Card>

      <Card title="Structured Scan Results">
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.asset} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-primary">{row.asset}</p>
                <p className="text-body text-neutral">{row.bias}</p>
              </div>
              <p className="text-body text-slate-700">Confidence: {row.confidence}</p>
              <p className="text-body text-slate-700">Supporting metrics: {row.metric}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
