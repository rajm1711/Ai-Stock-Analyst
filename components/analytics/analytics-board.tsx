import { Card } from "@/components/ui/card";
import { ChartShell } from "@/components/charts/chart-shell";

export function AnalyticsBoard() {
  return (
    <div className="section-gap">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Signal Win Rate"><p className="text-2xl font-semibold">63.4%</p></Card>
        <Card title="Bias Accuracy"><p className="text-2xl font-semibold">67.8%</p></Card>
        <Card title="Average Return Simulation"><p className="text-2xl font-semibold">1.9R</p></Card>
        <Card title="Best-Performing Strategy"><p className="text-2xl font-semibold">Macro + Trend Composite</p></Card>
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartShell title="Timeframe Performance Comparison" description="1H vs 4H vs 1D outcome profiles" />
        <ChartShell title="Strategy Performance Regimes" description="Performance by volatility and macro condition" />
      </section>
    </div>
  );
}
