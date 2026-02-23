"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { appStoreActions, useAppStore } from "@/store/use-app-store";

const SCANNER_TYPES = ["breakout", "momentum", "reversal"];

export function ScannerView() {
  const [type, setType] = useState("breakout");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const results = useAppStore((state) => state.scannerResults);

  useEffect(() => {
    setLoading(true);
    api
      .getScanner(type)
      .then((payload) => {
        appStoreActions.setScannerResults(payload);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <section className="section-gap">
      <article className="card">
        <p className="mb-2 text-sm font-semibold">Scanner Type</p>
        <div className="flex gap-2">
          {SCANNER_TYPES.map((value) => (
            <button
              key={value}
              onClick={() => setType(value)}
              className={`rounded-md px-3 py-1.5 text-sm ${type === value ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-300"}`}
            >
              {value}
            </button>
          ))}
        </div>
      </article>

      {loading && <div className="h-40 animate-pulse rounded-xl bg-slate-800/50" />}
      {error && <p className="text-sm text-rose-400">{error}</p>}

      {!loading && !error && (
        <article className="card">
          <p className="mb-3 text-sm font-semibold">Scanner Results</p>
          <div className="space-y-2">
            {results.map((item) => (
              <div key={`${item.symbol}-${item.signalType}`} className="grid grid-cols-2 gap-2 rounded-md bg-slate-800/70 p-3 text-sm md:grid-cols-5">
                <span>{item.symbol}</span>
                <span>{item.signalType}</span>
                <span>{item.trendDirection}</span>
                <span>RSI {item.rsi.toFixed(1)}</span>
                <span>Vol {item.volumeSpike.toFixed(2)}x</span>
              </div>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
