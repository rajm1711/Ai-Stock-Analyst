import { Card } from "@/components/ui/card";
import { ChartShell } from "@/components/charts/chart-shell";

const indices = [
  { name: "S&P 500", value: "5,210.18", move: "+0.42%" },
  { name: "Nasdaq", value: "18,110.97", move: "+0.51%" },
  { name: "Dow", value: "39,484.51", move: "+0.21%" },
  { name: "Russell 2000", value: "2,093.61", move: "-0.08%" }
];

export default function OverviewPage() {
  return (
    <div className="section-gap">
      <h1 className="text-page text-primary">Market Intelligence Overview</h1>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {indices.map((index) => (
          <Card key={index.name} title={index.name}>
            <p className="text-2xl font-semibold text-slate-900">{index.value}</p>
            <p className="text-neutral">{index.move}</p>
          </Card>
        ))}
      </section>
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <ChartShell title="Cross-Asset Trend Monitor" description="Macro-aware performance and volatility context" />
        </div>
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <Card title="Priority Watchlist">
            <ul className="space-y-2 text-body text-slate-700">
              <li>AAPL · Earnings momentum divergence</li>
              <li>MSFT · Relative strength continuation</li>
              <li>EUR/USD · Policy spread repricing watch</li>
            </ul>
          </Card>
          <Card title="Market News">
            <ul className="space-y-2 text-body text-slate-700">
              <li>US Treasury auction demand modestly improves.</li>
              <li>Fed speakers reinforce data-dependent policy stance.</li>
              <li>Semiconductor guidance revisions remain constructive.</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
