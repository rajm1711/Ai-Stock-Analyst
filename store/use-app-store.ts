"use client";

import { useSyncExternalStore } from "react";
import type { MarketOverview, ScannerResult } from "@/services/api";

type ConnectionState = "connecting" | "connected" | "disconnected";

type AppState = {
  selectedSymbol: string;
  marketOverview: MarketOverview | null;
  scannerResults: ScannerResult[];
  wsState: ConnectionState;
};

const state: AppState = {
  selectedSymbol: "SPY",
  marketOverview: null,
  scannerResults: [],
  wsState: "disconnected"
};

const listeners = new Set<() => void>();

function setState(partial: Partial<AppState>) {
  Object.assign(state, partial);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAppStore<T>(selector: (s: AppState) => T) {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export const appStoreActions = {
  setSelectedSymbol: (selectedSymbol: string) => setState({ selectedSymbol }),
  setMarketOverview: (marketOverview: MarketOverview) => setState({ marketOverview }),
  setScannerResults: (scannerResults: ScannerResult[]) => setState({ scannerResults }),
  setWsState: (wsState: ConnectionState) => setState({ wsState })
};
