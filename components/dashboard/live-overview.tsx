"use client";

import useSWR from "swr";
import { Card } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const indices = ["SPY", "QQQ", "DIA", "IWM"];
const fxPairs = ["EURUSD", "GBPUSD", "USDJPY"];

export function LiveOverview() {
  const { data: quotes } = useSWR(indices.map((s) => `/api/stock/${s}`), async (urls: string[]) => Promise.all(urls.map(fetcher)), {
    refreshInterval: 60_000
  });
  const { data: forex } = useSWR(fxPairs.map((p) => `/api/forex/${p}`), async (urls: string[]) => Promise.all(urls.map(fetcher)), {
    refreshInterval: 60_000
  });
  const { data: news } = useSWR("/api/news/SPY", fetcher, { refreshInterval: 600_000 });

  return (
    <div className="section-gap">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(quotes ?? []).map((item: { data?: { symbol: string; price: number; percentChange: number } }) => (
          <Card key={item.data?.symbol} title={item.data?.symbol ?? "Loading"}>
            <p className="text-2xl font-semibold text-slate-900">{item.data?.price?.toFixed(2) ?? "--"}</p>
            <p className="text-neutral">{item.data?.percentChange?.toFixed(2) ?? "0.00"}%</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-6">
          <Card title="Trending Forex Pairs">
            <ul className="space-y-2 text-body text-slate-700">
              {(forex ?? []).map((item: { data?: { pair: string; rate: number } }) => (
                <li key={item.data?.pair}>{item.data?.pair}: {item.data?.rate?.toFixed(5) ?? "--"}</li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="col-span-12 space-y-6 lg:col-span-6">
          <Card title="Market News">
            <ul className="space-y-2 text-body text-slate-700">
              {(news?.data ?? []).slice(0, 4).map((n: { id: string; headline: string }) => <li key={n.id}>{n.headline}</li>)}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
