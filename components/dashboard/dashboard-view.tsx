"use client";

import { useEffect, useState } from "react";
import { api, type MarketOverview } from "@/services/api";
import { appStoreActions, useAppStore } from "@/store/use-app-store";

export function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const marketOverview = useAppStore((state) => state.marketOverview);

  useEffect(() => {
    api
      .getMarketOverview()
      .then((payload) => {
        appStoreActions.setMarketOverview(payload);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error || !marketOverview) return <p className="text-sm text-rose-400">{error ?? "Unable to load market overview."}</p>;

  return <DashboardContent data={marketOverview} />;
}

function DashboardContent({ data }: { data: MarketOverview }) {
  return (
    <section className="section-gap">
      <div className="grid gap-3 md:grid-cols-4">
        {data.marketIndices.map((item) => (
          <article key={item.symbol} className="card">
            <p className="text-xs text-slate-400">{item.symbol}</p>
            <p className="text-xl font-semibold">{item.price.toFixed(2)}</p>
            <p className={item.change >= 0 ? "text-emerald-400" : "text-rose-400"}>{item.changePercent.toFixed(2)}%</p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="card">
          <p className="text-xs text-slate-400">DXY</p>
          <p className="text-lg font-semibold">{data.dxy.value.toFixed(2)}</p>
        </article>
        <article className="card">
          <p className="text-xs text-slate-400">VIX</p>
          <p className="text-lg font-semibold">{data.vix.value.toFixed(2)}</p>
        </article>
      </div>

      <article className="card">
        <p className="mb-2 text-sm font-semibold">Market Bias Summary</p>
        <p className="text-sm text-slate-300">{data.marketBiasSummary}</p>
      </article>

      <article className="card">
        <p className="mb-2 text-sm font-semibold">Latest AI Market Overview</p>
        <p className="text-sm text-slate-300">{data.latestAiOverview}</p>
      </article>

      <article className="card">
        <p className="mb-3 text-sm font-semibold">Top Scanner Signals</p>
        <div className="space-y-2">
          {data.topScannerSignals.map((signal) => (
            <div key={`${signal.symbol}-${signal.signal}`} className="flex items-center justify-between rounded-md bg-slate-800/70 p-2 text-sm">
              <span>{signal.symbol}</span>
              <span className="text-slate-300">{signal.signal}</span>
              <span className="text-sky-400">{signal.confidence}%</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function DashboardSkeleton() {
  return <div className="h-60 animate-pulse rounded-xl bg-slate-800/50" />;
}
