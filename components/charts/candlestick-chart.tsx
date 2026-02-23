"use client";

import { useMemo } from "react";
import type { ResearchPayload } from "@/services/api";

type Props = { data: ResearchPayload["candles"]; height?: number };

export function CandlestickChart({ data, height = 360 }: Props) {
  const chartData = useMemo(() => {
    if (!data.length) return [];
    const highs = data.map((c) => c.high);
    const lows = data.map((c) => c.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const range = max - min || 1;

    return data.map((candle, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const mapY = (value: number) => 100 - ((value - min) / range) * 100;
      return {
        ...candle,
        x,
        highY: mapY(candle.high),
        lowY: mapY(candle.low),
        openY: mapY(candle.open),
        closeY: mapY(candle.close)
      };
    });
  }, [data]);

  return (
    <div className="card">
      <p className="mb-3 text-sm font-medium text-slate-200">Candlestick Chart</p>
      <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          {chartData.map((candle) => {
            const bullish = candle.close >= candle.open;
            const color = bullish ? "#22c55e" : "#ef4444";
            const top = Math.min(candle.openY, candle.closeY);
            const bodyHeight = Math.max(Math.abs(candle.openY - candle.closeY), 0.5);

            return (
              <g key={`${candle.time}-${candle.x}`}>
                <line x1={candle.x} y1={candle.highY} x2={candle.x} y2={candle.lowY} stroke={color} strokeWidth="0.3" />
                <rect x={candle.x - 0.4} y={top} width={0.8} height={bodyHeight} fill={color} />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
