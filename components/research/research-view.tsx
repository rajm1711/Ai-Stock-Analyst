"use client";

import { useEffect, useState } from "react";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { api, type ResearchPayload } from "@/services/api";
import { appStoreActions } from "@/store/use-app-store";

type Props = { symbol: string };

export function ResearchView({ symbol }: Props) {
  const [data, setData] = useState<ResearchPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    appStoreActions.setSelectedSymbol(symbol);
    setLoading(true);
    api
      .getResearch(symbol)
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return <div className="h-72 animate-pulse rounded-xl bg-slate-800/50" />;
  if (error || !data) return <p className="text-sm text-rose-400">{error ?? "Unable to load research."}</p>;

  return (
    <section className="section-gap">
      <CandlestickChart data={data.candles} />

      <div className="grid gap-3 md:grid-cols-2">
        <article className="card">
          <p className="mb-2 text-sm font-semibold">Technical Summary</p>
          <p className="text-sm text-slate-300">{data.technicalSummary.summary}</p>
          <p className="mt-2 text-xs text-slate-400">Trend: {data.technicalSummary.trend}</p>
        </article>
        <article className="card">
          <p className="mb-2 text-sm font-semibold">Support / Resistance</p>
          <p className="text-sm text-slate-300">Support: {data.technicalSummary.support.join(", ")}</p>
          <p className="text-sm text-slate-300">Resistance: {data.technicalSummary.resistance.join(", ")}</p>
        </article>
      </div>

      <article className="card">
        <p className="mb-2 text-sm font-semibold">AI Structured Report</p>
        <p className="text-sm text-slate-300">{data.aiReport}</p>
      </article>

      <article className="card">
        <p className="mb-2 text-sm font-semibold">News</p>
        <div className="space-y-2">
          {data.news.map((item) => (
            <div key={item.id} className="rounded-lg bg-slate-800/70 p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-slate-400">{item.source}</p>
              <p className="mt-1 text-sm text-slate-300">{item.summary}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
