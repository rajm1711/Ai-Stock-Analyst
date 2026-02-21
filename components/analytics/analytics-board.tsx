"use client";

import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { ChartShell } from "@/components/charts/chart-shell";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AnalyticsBoard() {
  const { data } = useSWR("/api/macro", fetcher, { refreshInterval: 300_000 });
  return (
    <div className="section-gap">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Live Macro Intelligence"><p className="text-body">{data?.summary ? "Active" : "Loading"}</p></Card>
        <Card title="Signal Coverage"><p className="text-2xl font-semibold">Dynamic</p></Card>
        <Card title="Regime"><p className="text-2xl font-semibold">AI-derived</p></Card>
        <Card title="Update Cadence"><p className="text-2xl font-semibold">5m</p></Card>
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartShell title="Timeframe Performance Comparison" description="Live market + AI context" />
        <Card title="Macro Summary"><p className="whitespace-pre-wrap text-body text-slate-700">{data?.summary ?? "Loading macro summary..."}</p></Card>
      </section>
    </div>
  );
}
