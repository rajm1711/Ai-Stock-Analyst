"use client";

import { useEffect, useState } from "react";
import { api, type NewsPayload } from "@/services/api";

type Props = { symbol: string };

export function NewsView({ symbol }: Props) {
  const [data, setData] = useState<NewsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getNews(symbol)
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-800/50" />;
  if (error || !data) return <p className="text-sm text-rose-400">{error ?? "Unable to load news."}</p>;

  return (
    <section className="section-gap">
      <article className="card">
        <p className="mb-2 text-sm font-semibold">AI Catalyst Overview</p>
        <p className="text-sm text-slate-300">{data.catalystOverview}</p>
      </article>

      <article className="card">
        <p className="mb-3 text-sm font-semibold">News</p>
        <div className="space-y-2">
          {data.news.map((item) => (
            <div key={item.id} className="rounded-md bg-slate-800/70 p-3">
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
